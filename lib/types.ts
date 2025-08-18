export interface User {
  id: number
  email: string
  name?: string
}

export interface Project {
  id: number
  name: string
  slug: string
  createdAt: string
  updatedAt: string
  users: User[]
}

export interface Song {
  id: number
  title: string
  createdBy: User
  createdAt: string
  updatedAt: string
  file: {
    id: number
    fileName: string
    mimeType: string
    size: number
    url: string
  }
  duration?: number
  bpm?: number
  lyrics?: string
}

export interface Session {
  accessToken: string
  refreshToken: string
  user: User
}

export interface ProjectInvitation {
  id: number
  project: Project
  invitedBy: User
  createdAt: string
}
