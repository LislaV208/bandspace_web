"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { FileAudio, Pause, Play, X } from "lucide-react";
import { useEffect, useReducer, useRef } from "react";

interface AudioPreviewPlayerProps {
  file: File;
  onRemove?: () => void;
  className?: string;
}

interface AudioPreviewState {
  status: "loading" | "ready" | "playing" | "paused" | "error";
  position: number;
  duration: number;
  error: string | null;
  isDragging: boolean;
  dragPosition: number;
}

type AudioPreviewAction =
  | { type: "PLAY" }
  | { type: "PAUSE" }
  | { type: "SEEK_START"; position: number }
  | { type: "SEEK_UPDATE"; position: number }
  | { type: "SEEK_END"; position: number }
  | { type: "TIME_UPDATE"; position: number }
  | { type: "LOADED"; duration: number }
  | { type: "ERROR"; error: string }
  | { type: "RESET" };

const initialState: AudioPreviewState = {
  status: "loading",
  position: 0,
  duration: 0,
  error: null,
  isDragging: false,
  dragPosition: 0,
};

function audioPreviewReducer(
  state: AudioPreviewState,
  action: AudioPreviewAction
): AudioPreviewState {
  switch (action.type) {
    case "PLAY":
      return { ...state, status: "playing" };

    case "PAUSE":
      return { ...state, status: "paused" };

    case "SEEK_START":
      return {
        ...state,
        isDragging: true,
        dragPosition: action.position,
        position: action.position,
      };

    case "SEEK_UPDATE":
      return {
        ...state,
        dragPosition: action.position,
        position: action.position,
      };

    case "SEEK_END":
      return {
        ...state,
        isDragging: false,
        position: action.position,
      };

    case "TIME_UPDATE":
      if (state.isDragging) return state;
      return { ...state, position: action.position };

    case "LOADED":
      return {
        ...state,
        status: "ready",
        duration: action.duration,
        error: null,
      };

    case "ERROR":
      return { ...state, status: "error", error: action.error };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

export function AudioPreviewPlayer({
  file,
  onRemove,
  className,
}: AudioPreviewPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [state, dispatch] = useReducer(audioPreviewReducer, initialState);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !file) return;

    const fileUrl = URL.createObjectURL(file);
    audio.src = fileUrl;
    audio.load();

    const handleLoadedMetadata = () => {
      dispatch({ type: "LOADED", duration: audio.duration });
    };
    const handleTimeUpdate = () => {
      dispatch({ type: "TIME_UPDATE", position: audio.currentTime });
    };
    const handleEnded = () => {
      dispatch({ type: "PAUSE" });
    };
    const handleError = () => {
      dispatch({ type: "ERROR", error: "Nie udało się załadować pliku audio" });
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      URL.revokeObjectURL(fileUrl);
    };
  }, [file]);

  // Handle play/pause state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (state.status === "playing" && audio.paused) {
      audio.play().catch((error) => {
        dispatch({ type: "ERROR", error: error.message });
      });
    } else if (state.status === "paused" && !audio.paused) {
      audio.pause();
    }
  }, [state.status]);

  // Handle seek changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || state.isDragging) return;

    if (Math.abs(audio.currentTime - state.position) > 1) {
      audio.currentTime = state.position;
    }
  }, [state.position, state.isDragging]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const handlePlayPause = () => {
    if (state.status === "playing") {
      dispatch({ type: "PAUSE" });
    } else if (state.status === "ready" || state.status === "paused") {
      dispatch({ type: "PLAY" });
    }
  };

  const handleSeek = (value: number[]) => {
    const position = value[0];
    if (!state.isDragging) {
      dispatch({ type: "SEEK_START", position });
    } else {
      dispatch({ type: "SEEK_UPDATE", position });
    }
  };

  const handleSeekEnd = (value: number[]) => {
    const position = value[0];
    dispatch({ type: "SEEK_END", position });
  };

  return (
    <div
      className={`border border-border rounded-lg p-4 bg-muted/20 ${className}`}
    >
      <audio ref={audioRef} preload="metadata" />

      {/* File Info Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <FileAudio className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatFileSize(file.size)} • {file.type}
            </p>
          </div>
        </div>
        {onRemove && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {state.error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg mb-4 flex items-center space-x-2">
          <FileAudio className="h-4 w-4" />
          <span>{state.error}</span>
        </div>
      )}

      {state.status === "loading" && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          <span>Ładowanie...</span>
        </div>
      )}

      {(state.status === "ready" ||
        state.status === "playing" ||
        state.status === "paused") && (
        <div className="space-y-4">
          {/* Main Controls */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePlayPause}
              className="h-10 w-10 rounded-full"
            >
              {state.status === "playing" ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>

            <div className="flex-1 space-y-2">
              {/* Time Display */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="tabular-nums">
                  {formatTime(state.position)}
                </span>
                <span className="tabular-nums">
                  {formatTime(state.duration)}
                </span>
              </div>

              {/* Progress Slider */}
              <Slider
                value={[state.position]}
                max={state.duration || 100}
                step={1}
                onValueChange={handleSeek}
                onValueCommit={handleSeekEnd}
                className="w-full"
                disabled={!state.duration}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
