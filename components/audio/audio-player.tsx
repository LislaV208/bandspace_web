"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-indicator"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Song } from "@/lib/types"

interface AudioPlayerProps {
  songs: Song[]
  currentSongIndex: number
  onSongChange: (index: number) => void
  className?: string
}

export function AudioPlayer({ songs, currentSongIndex, onSongChange, className }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentSong = songs[currentSongIndex]

  // Update audio source when song changes
  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.file.url
      audioRef.current.load()
      setCurrentTime(0)
      setError(null)
    }
  }, [currentSong])

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)
    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleEnded = () => {
      setIsPlaying(false)
      handleNext()
    }
    const handleError = () => {
      setError("Nie udało się załadować pliku audio")
      setIsLoading(false)
      setIsPlaying(false)
    }

    audio.addEventListener("loadstart", handleLoadStart)
    audio.addEventListener("canplay", handleCanPlay)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart)
      audio.removeEventListener("canplay", handleCanPlay)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
    }
  }, [])

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handlePlayPause = async () => {
    if (!audioRef.current || !currentSong) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        await audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error("Playback error:", error)
      setError("Nie udało się odtworzyć")
      setIsPlaying(false)
    }
  }

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return
    const newTime = value[0]
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return
    const newVolume = value[0]
    audioRef.current.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const handleMute = () => {
    if (!audioRef.current) return
    if (isMuted) {
      audioRef.current.volume = volume
      setIsMuted(false)
    } else {
      audioRef.current.volume = 0
      setIsMuted(true)
    }
  }

  const handlePrevious = useCallback(() => {
    if (songs.length === 0) return

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * songs.length)
      onSongChange(randomIndex)
    } else {
      const prevIndex = currentSongIndex > 0 ? currentSongIndex - 1 : songs.length - 1
      onSongChange(prevIndex)
    }
  }, [currentSongIndex, songs.length, isShuffle, onSongChange])

  const handleNext = useCallback(() => {
    if (songs.length === 0) return

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * songs.length)
      onSongChange(randomIndex)
    } else if (isRepeat) {
      // Stay on current song
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
        setIsPlaying(true)
      }
    } else {
      const nextIndex = currentSongIndex < songs.length - 1 ? currentSongIndex + 1 : 0
      onSongChange(nextIndex)
    }
  }, [currentSongIndex, songs.length, isShuffle, isRepeat, onSongChange])

  if (!currentSong) {
    return (
      <Card className={`border-border bg-card ${className}`}>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <p>No song selected</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`border-border bg-card ${className}`}>
      <CardContent className="p-6">
        <audio ref={audioRef} preload="metadata" />

        <div className="space-y-4">
          {/* Song Info */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">{currentSong.title}</h3>
              <p className="text-sm text-muted-foreground">
                By {currentSong.createdBy.name || currentSong.createdBy.email}
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {currentSong.file?.mimeType?.split("/")[1]?.toUpperCase() || "AUDIO"}
                </Badge>
                {currentSong.bpm && (
                  <Badge variant="outline" className="text-xs">
                    {currentSong.bpm} BPM
                  </Badge>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Dodaj do playlisty</DropdownMenuItem>
                <DropdownMenuItem>Share Song</DropdownMenuItem>
                <DropdownMenuItem>Pobierz</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
              disabled={isLoading || !duration}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            {/* Shuffle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsShuffle(!isShuffle)}
              className={`h-8 w-8 ${isShuffle ? "text-primary" : "text-muted-foreground"}`}
            >
              <Shuffle className="h-4 w-4" />
            </Button>

            {/* Previous */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              disabled={songs.length <= 1}
              className="h-10 w-10"
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            {/* Play/Pause */}
            <Button
              variant="outline"
              size="icon"
              onClick={handlePlayPause}
              disabled={isLoading || !!error}
              className="h-12 w-12 rounded-full border-border hover:bg-primary hover:text-primary-foreground bg-transparent"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>

            {/* Next */}
            <Button variant="ghost" size="icon" onClick={handleNext} disabled={songs.length <= 1} className="h-10 w-10">
              <SkipForward className="h-5 w-5" />
            </Button>

            {/* Repeat */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsRepeat(!isRepeat)}
              className={`h-8 w-8 ${isRepeat ? "text-primary" : "text-muted-foreground"}`}
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMute}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>

            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
              className="flex-1 max-w-24"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg text-center">{error}</div>
          )}

          {/* Playlist Info */}
          {songs.length > 1 && (
            <div className="text-center text-xs text-muted-foreground">
              {currentSongIndex + 1} of {songs.length} songs
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
