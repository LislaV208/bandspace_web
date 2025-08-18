"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { FileAudio } from "lucide-react"
import type { Song } from "@/lib/types"

interface EditSongDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  song: Song | null
  onSongUpdated?: (song: Song) => void
}

export function EditSongDialog({ open, onOpenChange, song, onSongUpdated }: EditSongDialogProps) {
  const [title, setTitle] = useState("")
  const [bpm, setBpm] = useState("")
  const [lyrics, setLyrics] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (song) {
      setTitle(song.title)
      setBpm(song.bpm?.toString() || "")
      setLyrics(song.lyrics || "")
    }
  }, [song])

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  const formatDuration = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000)
    const seconds = Math.floor((milliseconds % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!song || !title.trim()) return

    setIsLoading(true)

    try {
      const updates = {
        title: title.trim(),
        bpm: bpm ? Number.parseInt(bpm) : undefined,
        lyrics: lyrics.trim() || undefined,
      }

      // TODO: Replace with actual API call
      console.log("Updating song:", { songId: song.id, updates })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update song in parent component
      const updatedSong = { ...song, ...updates }
      onSongUpdated?.(updatedSong)
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to update song:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false)
    }
  }

  if (!song) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Song</DialogTitle>
          <DialogDescription className="text-muted-foreground">Update song metadata and lyrics.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Info */}
          <div className="border border-border rounded-lg p-4 bg-muted/20">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <FileAudio className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{song.file.fileName}</p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>{formatFileSize(song.file.size)}</span>
                  <span>{song.file.mimeType?.split("/")[1]?.toUpperCase() || "AUDIO"}</span>
                  {song.duration && <span>{formatDuration(song.duration)}</span>}
                </div>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <Badge variant="secondary" className="text-xs">
                  {song.file.mimeType?.split("/")[1]?.toUpperCase() || "AUDIO"}
                </Badge>
                <span className="text-xs text-muted-foreground">{new Date(song.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground">
                Song Title *
              </Label>
              <Input
                id="title"
                placeholder="Enter song title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-input border-border"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bpm" className="text-foreground">
                BPM (Optional)
              </Label>
              <Input
                id="bpm"
                type="number"
                placeholder="e.g. 120"
                value={bpm}
                onChange={(e) => setBpm(e.target.value)}
                className="bg-input border-border"
                disabled={isLoading}
                min="1"
                max="300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lyrics" className="text-foreground">
                Lyrics (Optional)
              </Label>
              <Textarea
                id="lyrics"
                placeholder="Enter song lyrics..."
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                className="bg-input border-border resize-none"
                disabled={isLoading}
                rows={6}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!title.trim() || isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
