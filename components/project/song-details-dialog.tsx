"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileAudio, User, Calendar, Clock, Music, FileText, Download } from "lucide-react"
import type { Song } from "@/lib/types"

interface SongDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  song: Song | null
}

export function SongDetailsDialog({ open, onOpenChange, song }: SongDetailsDialogProps) {
  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  const formatDuration = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000)
    const seconds = Math.floor((milliseconds % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleDownload = async () => {
    if (!song) return

    try {
      // TODO: Replace with actual download API call
      console.log("Downloading song:", song.id)

      // For now, just open the file URL
      window.open(song.file.url, "_blank")
    } catch (error) {
      console.error("Failed to download song:", error)
    }
  }

  if (!song) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center space-x-2">
            <FileAudio className="h-5 w-5 text-primary" />
            <span>{song.title}</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">Szczegółowe informacje o tym utworze</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Informacje o pliku</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <FileAudio className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Nazwa pliku:</span>
                </div>
                <p className="text-foreground font-medium">{song.file.fileName}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Badge variant="outline" className="w-fit">
                    {song.file.mimeType?.split("/")[1]?.toUpperCase() || "AUDIO"}
                  </Badge>
                </div>
                <p className="text-foreground font-medium">{formatFileSize(song.file.size)}</p>
              </div>
            </div>

            {song.duration && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Czas trwania:</span>
                </div>
                <p className="text-foreground font-medium">{formatDuration(song.duration)}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Song Metadata */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Szczegóły utworu</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Utworzono przez:</span>
                </div>
                <p className="text-foreground font-medium">{song.createdBy.name || song.createdBy.email}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Data utworzenia:</span>
                </div>
                <p className="text-foreground font-medium">{formatDate(song.createdAt)}</p>
              </div>
            </div>

            {song.bpm && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Music className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">BPM:</span>
                </div>
                <p className="text-foreground font-medium">{song.bpm}</p>
              </div>
            )}

            {song.updatedAt !== song.createdAt && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Ostatnia aktualizacja:</span>
                </div>
                <p className="text-foreground font-medium">{formatDate(song.updatedAt)}</p>
              </div>
            )}
          </div>

          {/* Lyrics */}
          {song.lyrics && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-foreground">Tekst</h3>
                </div>

                <ScrollArea className="h-32 w-full rounded-lg border border-border p-4 bg-muted/20">
                  <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">{song.lyrics}</pre>
                </ScrollArea>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={handleDownload}
              className="border-border hover:bg-secondary bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              Pobierz
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Zamknij
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
