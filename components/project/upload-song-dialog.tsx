"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Upload } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { apiClient, ApiError } from "@/lib/api"
import { AudioPreviewPlayer } from "@/components/audio/audio-preview-player"

interface UploadSongDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: number
  onSongUploaded?: () => void
}

interface SongMetadata {
  title: string
  bpm: string
  lyrics: string
}

export function UploadSongDialog({ open, onOpenChange, projectId, onSongUploaded }: UploadSongDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [metadata, setMetadata] = useState<SongMetadata>({
    title: "",
    bpm: "",
    lyrics: "",
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        setSelectedFile(file)
        setError(null)
        // Auto-populate title from filename
        if (!metadata.title) {
          const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "")
          setMetadata((prev) => ({ ...prev, title: nameWithoutExt }))
        }
      }
    },
    [metadata.title],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".wav", ".flac", ".m4a", ".aac"],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0]
      if (rejection.errors[0]?.code === "file-too-large") {
        setError("Rozmiar pliku musi być mniejszy niż 50MB")
      } else if (rejection.errors[0]?.code === "file-invalid-type") {
        setError("Proszę prześlać prawidłowy plik dźwiękowy (MP3, WAV, FLAC, M4A, AAC)")
      } else {
        setError("Nieprawidłowy plik. Spróbuj ponownie.")
      }
    },
  })


  const handleUpload = async () => {
    if (!selectedFile || !metadata.title.trim()) return

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("title", metadata.title)
      if (metadata.bpm) formData.append("bpm", metadata.bpm)
      if (metadata.lyrics) formData.append("lyrics", metadata.lyrics)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + Math.random() * 10
        })
      }, 200)

      await apiClient.uploadSong(projectId, formData)

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Reset form and close dialog
      setTimeout(() => {
        setSelectedFile(null)
        setMetadata({ title: "", bpm: "", lyrics: "" })
        setUploadProgress(0)
        onOpenChange(false)
        onSongUploaded?.()
      }, 500)
    } catch (error) {
      console.error("Failed to upload song:", error)
      if (error instanceof ApiError) {
        setError(error.message)
      } else {
        setError("Nie udało się prześlać utworu. Spróbuj ponownie.")
      }
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setError(null)
  }

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null)
      setMetadata({ title: "", bpm: "", lyrics: "" })
      setUploadProgress(0)
      setError(null)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Prześlij Utwór</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Dodaj nowy utwór do projektu z metadanymi i tekstem.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Area */}
          {!selectedFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/20"
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-foreground font-medium">
                    {isDragActive ? "Upuść plik dźwiękowy tutaj" : "Przeciągnij i upuść plik dźwiękowy"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    lub kliknij aby przeglądać (MP3, WAV, FLAC, M4A, AAC - maks. 50MB)
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <AudioPreviewPlayer
              file={selectedFile}
              onRemove={!isUploading ? handleRemoveFile : undefined}
            />
          )}

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</div>}

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground">Przesyłanie...</span>
                <span className="text-muted-foreground">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Metadata Form */}
          {selectedFile && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground">
                  Tytuł Utworu *
                </Label>
                <Input
                  id="title"
                  placeholder="Wprowadź tytuł utworu"
                  value={metadata.title}
                  onChange={(e) => setMetadata((prev) => ({ ...prev, title: e.target.value }))}
                  className="bg-input border-border"
                  disabled={isUploading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bpm" className="text-foreground">
                  BPM (Opcjonalnie)
                </Label>
                <Input
                  id="bpm"
                  type="number"
                  placeholder="np. 120"
                  value={metadata.bpm}
                  onChange={(e) => setMetadata((prev) => ({ ...prev, bpm: e.target.value }))}
                  className="bg-input border-border"
                  disabled={isUploading}
                  min="1"
                  max="300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lyrics" className="text-foreground">
                  Tekst (Opcjonalnie)
                </Label>
                <Textarea
                  id="lyrics"
                  placeholder="Wprowadź tekst utworu..."
                  value={metadata.lyrics}
                  onChange={(e) => setMetadata((prev) => ({ ...prev, lyrics: e.target.value }))}
                  className="bg-input border-border resize-none"
                  disabled={isUploading}
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose} disabled={isUploading}>
              Anuluj
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !metadata.title.trim() || isUploading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isUploading ? "Przesyłanie..." : "Prześlij Utwór"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
