"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react"
import type { Song } from "@/lib/types"

interface MiniPlayerProps {
  song: Song | null
  isPlaying: boolean
  onPlayPause: () => void
  onNext?: () => void
  onPrevious?: () => void
  className?: string
}

export function MiniPlayer({ song, isPlaying, onPlayPause, onNext, onPrevious, className }: MiniPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    if (audioRef.current && song) {
      audioRef.current.src = song.file.url
      audioRef.current.load()
    }
  }, [song])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)

    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("timeupdate", handleTimeUpdate)

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
    }
  }, [])

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
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

  if (!song) return null

  return (
    <div className={`bg-card border-t border-border p-4 ${className}`}>
      <audio ref={audioRef} preload="metadata" />

      <div className="flex items-center space-x-4">
        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{song.title}</p>
          <p className="text-sm text-muted-foreground truncate">{song.createdBy.name || song.createdBy.email}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          {onPrevious && (
            <Button variant="ghost" size="icon" onClick={onPrevious} className="h-8 w-8">
              <SkipBack className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={onPlayPause}
            className="h-10 w-10 rounded-full border-border hover:bg-primary hover:text-primary-foreground bg-transparent"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          {onNext && (
            <Button variant="ghost" size="icon" onClick={onNext} className="h-8 w-8">
              <SkipForward className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Progress */}
        <div className="flex items-center space-x-2 flex-1 max-w-xs">
          <span className="text-xs text-muted-foreground w-10">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="flex-1"
            disabled={!duration}
          />
          <span className="text-xs text-muted-foreground w-10">{formatTime(duration)}</span>
        </div>

        {/* Volume */}
        <div className="flex items-center space-x-2">
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
            className="w-20"
          />
        </div>
      </div>
    </div>
  )
}
