"use client"

import { useState, useCallback } from "react"
import type { Song } from "@/lib/types"

interface UseAudioPlayerProps {
  songs: Song[]
  downloadUrls: Map<number, string>
  initialIndex?: number
}

export function useAudioPlayer({ songs, downloadUrls, initialIndex = 0 }: UseAudioPlayerProps) {
  const [currentSongIndex, setCurrentSongIndex] = useState(initialIndex)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState<Song | null>(songs[initialIndex] || null)

  const playPause = useCallback(() => {
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const playNext = useCallback(() => {
    if (songs.length === 0) return
    const nextIndex = currentSongIndex < songs.length - 1 ? currentSongIndex + 1 : 0
    setCurrentSongIndex(nextIndex)
    setCurrentSong(songs[nextIndex])
    setIsPlaying(true)
  }, [currentSongIndex, songs])

  const playPrevious = useCallback(() => {
    if (songs.length === 0) return
    const prevIndex = currentSongIndex > 0 ? currentSongIndex - 1 : songs.length - 1
    setCurrentSongIndex(prevIndex)
    setCurrentSong(songs[prevIndex])
    setIsPlaying(true)
  }, [currentSongIndex, songs])

  const playSong = useCallback(
    (index: number) => {
      if (index < 0 || index >= songs.length) return
      setCurrentSongIndex(index)
      setCurrentSong(songs[index])
      setIsPlaying(true)
    },
    [songs],
  )

  const changeSong = useCallback(
    (index: number) => {
      if (index < 0 || index >= songs.length) return
      setCurrentSongIndex(index)
      setCurrentSong(songs[index])
    },
    [songs],
  )

  return {
    currentSong,
    currentSongIndex,
    isPlaying,
    playPause,
    playNext,
    playPrevious,
    playSong,
    changeSong,
    setIsPlaying,
  }
}
