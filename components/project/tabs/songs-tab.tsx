"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { apiClient, ApiError } from "@/lib/api";
import type { Song } from "@/lib/types";
import {
  Edit,
  Info,
  MoreHorizontal,
  Music,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAudioPlayer } from "../../../hooks/use-audio-player";
import { AudioPlayer } from "../../audio/audio-player";
import { EditSongDialog } from "../edit-song-dialog";
import { SongDetailsDialog } from "../song-details-dialog";
import { UploadSongDialog } from "../upload-song-dialog";

interface SongsTabProps {
  projectId: number;
}

export function SongsTab({ projectId }: SongsTabProps) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [downloadUrls, setDownloadUrls] = useState<Map<number, string>>(
    new Map()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const { currentSong, currentSongIndex, changeSong } = useAudioPlayer({
    songs,
    downloadUrls,
  });

  useEffect(() => {
    loadSongs();
  }, [projectId]);

  const loadSongs = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Pobierz songs i download URLs jednocześnie
      const [songsData, downloadUrlsData] = await Promise.all([
        apiClient.getProjectSongs(projectId),
        apiClient.getProjectSongDownloadUrls(projectId),
      ]);

      setSongs(songsData);

      // Stwórz mapę songId -> downloadUrl
      const urlsMap = new Map<number, string>();
      downloadUrlsData.urls.forEach(({ songId, url }) => {
        urlsMap.set(songId, url);
      });
      setDownloadUrls(urlsMap);
    } catch (error) {
      console.error("Failed to load songs:", error);
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Nie udało się załadować utworów. Spróbuj ponownie.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.createdBy.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.createdBy.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSongUploaded = () => {
    loadSongs();
  };

  const handleSongUpdated = (updatedSong: Song) => {
    setSongs((prev) =>
      prev.map((song) => (song.id === updatedSong.id ? updatedSong : song))
    );
  };

  const handleDeleteSong = async (songId: number) => {
    if (
      !confirm(
        "Czy na pewno chcesz usunąć ten utwór? Ta operacja nie może zostać cofnięta."
      )
    ) {
      return;
    }

    try {
      await apiClient.deleteSong(projectId, songId);
      setSongs((prev) => prev.filter((song) => song.id !== songId));
    } catch (error) {
      console.error("Failed to delete song:", error);
      if (error instanceof ApiError) {
        alert(`Nie udało się usunąć utworu: ${error.message}`);
      } else {
        alert("Nie udało się usunąć utworu. Spróbuj ponownie.");
      }
    }
  };

  const handleEditSong = (song: Song) => {
    setSelectedSong(song);
    setShowEditDialog(true);
  };

  const handleViewDetails = (song: Song) => {
    setSelectedSong(song);
    setShowDetailsDialog(true);
  };

  const handleSelectSong = (song: Song) => {
    const songIndex = songs.findIndex((s) => s.id === song.id);
    if (songIndex !== -1) {
      changeSong(songIndex);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-muted rounded w-1/4 animate-pulse"></div>
          <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-border bg-card animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-6 bg-muted rounded w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
            Ostrzeżenie: {error}. Wyświetlanie zapisanych danych.
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative w-96">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Szukaj utworów..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-border"
              />
            </div>
          </div>

          <Button
            onClick={() => setShowUploadDialog(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Upload className="h-4 w-4 mr-2" />
            Nowy utwór
          </Button>
        </div>

        {/* Songs List */}
        {filteredSongs.length === 0 ? (
          <div className="text-center py-12">
            <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchQuery ? "Nie znaleziono utworów" : "Brak utworów"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "Spróbuj zmienić frazy wyszukiwania"
                : "Prześlij swój pierwszy utwór aby zacząć"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setShowUploadDialog(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Upload className="h-4 w-4 mr-2" />
                Nowy utwór
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredSongs.map((song) => (
              <Card
                key={song.id}
                className={`border-border transition-colors cursor-pointer ${
                  currentSong?.id === song.id
                    ? "bg-card/80 ring-1 ring-primary/20"
                    : "bg-card hover:bg-card/80"
                }`}
                onClick={() => handleSelectSong(song)}
              >
                <CardContent className="p-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center">
                          <Music className="h-6 w-6 text-muted-foreground" />
                        </div>

                        <div className="space-y-1">
                          <h3 className="font-semibold text-foreground">
                            {song.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>
                              Od {song.createdBy.name || song.createdBy.email}
                            </span>
                            {song.duration && (
                              <span>{formatDuration(song.duration)}</span>
                            )}
                            {song.bpm && <span>{song.bpm} BPM</span>}
                            <span>
                              {song.file?.size
                                ? formatFileSize(song.file.size)
                                : "Unknown size"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {song.file?.mimeType
                                ? song.file.mimeType
                                    .split("/")[1]
                                    ?.toUpperCase() || "UNKNOWN"
                                : "UNKNOWN"}
                            </Badge>
                            {song.lyrics && (
                              <Badge variant="outline" className="text-xs">
                                Ma tekst
                              </Badge>
                            )}
                            {currentSong?.id === song.id && (
                              <Badge
                                variant="default"
                                className="text-xs bg-primary"
                              >
                                Wybrane
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(song)}
                          >
                            <Info className="mr-2 h-4 w-4" />
                            Szczegóły
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditSong(song)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edytuj
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteSong(song.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Usuń
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Player */}
      {songs.length > 0 && currentSong && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <AudioPlayer
            songs={songs}
            downloadUrls={downloadUrls}
            currentSongIndex={currentSongIndex}
            onSongChange={changeSong}
            className="border-t bg-background/95 backdrop-blur-sm"
          />
        </div>
      )}

      {/* Dialogs */}
      <UploadSongDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        projectId={projectId}
        onSongUploaded={handleSongUploaded}
      />

      <EditSongDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        song={selectedSong}
        onSongUpdated={handleSongUpdated}
      />

      <SongDetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        song={selectedSong}
      />
    </>
  );
}
