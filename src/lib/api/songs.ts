import apiClient from './client';
import type { Song, CreateSongRequest, UpdateSongRequest, UploadProgress } from '../types/song';

export const songsAPI = {
  getSongs: async (projectId: string): Promise<Song[]> => {
    const response = await apiClient.get(`/projects/${projectId}/songs`);
    return response.data;
  },

  getSong: async (projectId: string, songId: string): Promise<Song> => {
    const response = await apiClient.get(`/projects/${projectId}/songs/${songId}`);
    return response.data;
  },

  uploadSong: async (
    projectId: string,
    songData: CreateSongRequest,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<Song> => {
    const formData = new FormData();
    formData.append('title', songData.title);
    formData.append('file', songData.file);

    const response = await apiClient.post(`/projects/${projectId}/songs`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress: UploadProgress = {
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: Math.round((progressEvent.loaded / progressEvent.total) * 100),
          };
          onProgress(progress);
        }
      },
    });
    return response.data;
  },

  updateSong: async (projectId: string, songId: string, songData: UpdateSongRequest): Promise<Song> => {
    const response = await apiClient.patch(`/projects/${projectId}/songs/${songId}`, songData);
    return response.data;
  },

  deleteSong: async (projectId: string, songId: string): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}/songs/${songId}`);
  },

  getDownloadUrl: async (projectId: string, songId: string): Promise<{ url: string }> => {
    const response = await apiClient.get(`/projects/${projectId}/songs/${songId}/download-url`);
    return response.data;
  },
};