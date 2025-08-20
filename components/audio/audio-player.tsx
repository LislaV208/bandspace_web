"use client";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-indicator";
import { Slider } from "@/components/ui/slider";
import type { Song } from "@/lib/types";
import {
  Music,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useReducer, useRef } from "react";

interface AudioPlayerProps {
  songs: Song[];
  downloadUrls: Map<number, string>;
  currentSongIndex: number;
  onSongChange: (index: number) => void;
  className?: string;
}

// State interface
interface AudioState {
  songId: number | null;
  status: "idle" | "loading" | "ready" | "playing" | "paused" | "error";
  position: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  shouldAutoPlay: boolean;
  error: string | null;
  isDragging: boolean;
  dragPosition: number;
}

// Action types
type AudioAction =
  | { type: "LOAD_SONG"; songId: number; autoPlay?: boolean }
  | { type: "PLAY" }
  | { type: "PAUSE" }
  | { type: "SEEK_START"; position: number }
  | { type: "SEEK_UPDATE"; position: number }
  | { type: "SEEK_END"; position: number }
  | { type: "TIME_UPDATE"; position: number }
  | { type: "LOADED"; duration: number }
  | { type: "ERROR"; error: string }
  | { type: "SET_VOLUME"; volume: number }
  | { type: "TOGGLE_MUTE" }
  | { type: "RESET" };

// Initial state
const initialState: AudioState = {
  songId: null,
  status: "idle",
  position: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  shouldAutoPlay: false,
  error: null,
  isDragging: false,
  dragPosition: 0,
};

// Reducer
function audioReducer(state: AudioState, action: AudioAction): AudioState {
  switch (action.type) {
    case "LOAD_SONG":
      return {
        ...state,
        songId: action.songId,
        status: "loading",
        position: 0,
        duration: 0,
        error: null,
        shouldAutoPlay: action.autoPlay || false,
        isDragging: false,
        dragPosition: 0,
      };

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
      if (state.isDragging) return state; // Don't update during drag
      return { ...state, position: action.position };

    case "LOADED":
      return {
        ...state,
        status: state.shouldAutoPlay ? "playing" : "ready",
        duration: action.duration,
      };

    case "ERROR":
      return { ...state, status: "error", error: action.error };

    case "SET_VOLUME":
      return {
        ...state,
        volume: action.volume,
        isMuted: action.volume === 0,
      };

    case "TOGGLE_MUTE":
      return {
        ...state,
        isMuted: !state.isMuted,
      };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

export function AudioPlayer({
  songs,
  downloadUrls,
  currentSongIndex,
  onSongChange,
  className,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [state, dispatch] = useReducer(audioReducer, initialState);

  const currentSong = songs[currentSongIndex];

  // Load new song when currentSongIndex changes
  useEffect(() => {
    if (currentSong && state.songId !== currentSong.id) {
      const wasPlaying = state.status === "playing";
      dispatch({
        type: "LOAD_SONG",
        songId: currentSong.id,
        autoPlay: wasPlaying,
      });
    }
  }, [currentSongIndex, currentSong, state.songId, state.status]);

  // Load audio source when song loading starts
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (state.status === "loading" && state.songId === currentSong.id) {
      const downloadUrl = downloadUrls.get(currentSong.id);
      if (!downloadUrl) {
        dispatch({
          type: "ERROR",
          error: "URL do pliku audio nie jest dostępny",
        });
        return;
      }

      console.log("Loading audio from:", downloadUrl);
      audio.src = downloadUrl;
      audio.volume = state.isMuted ? 0 : state.volume;
      audio.load();
    }
  }, [state.status, state.songId, currentSong, downloadUrls, state.isMuted, state.volume]);

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

  // Handle volume changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (state.isMuted) {
      audio.volume = 0;
    } else {
      audio.volume = state.volume;
    }
  }, [state.volume, state.isMuted]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = () => {
      if (state.shouldAutoPlay) {
        audio.play();
      }
    };

    const handleLoadedMetadata = () => {
      dispatch({ type: "LOADED", duration: audio.duration });
    };

    const handleTimeUpdate = () => {
      dispatch({ type: "TIME_UPDATE", position: audio.currentTime });
    };

    const handleEnded = () => {
      dispatch({ type: "PAUSE" });
      if (songs.length > 1) {
        const nextIndex =
          currentSongIndex < songs.length - 1 ? currentSongIndex + 1 : 0;
        onSongChange(nextIndex);
      }
    };

    const handleError = () => {
      dispatch({ type: "ERROR", error: "Nie udało się załadować pliku audio" });
    };

    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [currentSongIndex, onSongChange, songs.length, state.shouldAutoPlay]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Action dispatchers
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

  const handleMute = () => {
    dispatch({ type: "TOGGLE_MUTE" });
  };

  const handlePrevious = useCallback(() => {
    if (songs.length === 0) return;
    const prevIndex =
      currentSongIndex > 0 ? currentSongIndex - 1 : songs.length - 1;
    onSongChange(prevIndex);
  }, [currentSongIndex, songs.length, onSongChange]);

  const handleNext = useCallback(() => {
    if (songs.length === 0) return;
    const nextIndex =
      currentSongIndex < songs.length - 1 ? currentSongIndex + 1 : 0;
    onSongChange(nextIndex);
  }, [currentSongIndex, songs.length, onSongChange]);

  if (!currentSong) {
    return null;
  }

  return (
    <div className={`border-t bg-background/95 backdrop-blur-sm ${className}`}>
      <div className="px-4 py-3">
        <audio ref={audioRef} preload="metadata" />

        <div className="flex items-center gap-3">
          {/* Song Info */}
          <div className="flex items-center gap-3 min-w-0 w-64">
            <div className="h-10 w-10 rounded bg-accent flex items-center justify-center flex-shrink-0">
              <Music className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <h4 className="font-medium text-foreground truncate text-sm">
                {currentSong.title}
              </h4>
              <p className="text-xs text-muted-foreground truncate">
                {currentSong.createdBy.name || currentSong.createdBy.email}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 mx-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              disabled={songs.length <= 1}
              className="h-8 w-8"
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handlePlayPause}
              disabled={state.status === "loading" || state.status === "error"}
              className="h-9 w-9 rounded-full"
            >
              {state.status === "loading" ? (
                <LoadingSpinner size="sm" />
              ) : state.status === "playing" ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              disabled={songs.length <= 1}
              className="h-8 w-8"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Section - flex-1 to fill remaining space */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-xs text-muted-foreground tabular-nums flex-shrink-0">
              {formatTime(state.position)}
            </span>
            <Slider
              value={[state.position]}
              max={state.duration || 100}
              step={1}
              onValueChange={handleSeek}
              onValueCommit={handleSeekEnd}
              className="flex-1"
              disabled={state.status === "loading" || !state.duration}
            />
            <span className="text-xs text-muted-foreground tabular-nums flex-shrink-0">
              {formatTime(state.duration)}
            </span>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2 ml-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMute}
              className="h-8 w-8"
            >
              {state.isMuted || state.volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {state.error && (
          <div className="text-xs text-destructive mt-2 text-center">
            {state.error}
          </div>
        )}
      </div>
    </div>
  );
}
