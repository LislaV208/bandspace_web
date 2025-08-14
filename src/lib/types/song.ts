export interface Song {
  id: string;
  title: string;
  projectId: string;
  fileName: string;
  fileSize: number;
  duration?: number;
  createdAt: string;
  updatedAt: string;
  uploadedBy: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface CreateSongRequest {
  title: string;
  file: File;
}

export interface UpdateSongRequest {
  title?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}