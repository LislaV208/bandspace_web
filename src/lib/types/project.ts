export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  members: ProjectMember[];
  songsCount?: number;
}

export interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  role: 'owner' | 'member';
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

export interface Invitation {
  id: string;
  projectId: string;
  email: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  project: {
    id: string;
    name: string;
    description?: string;
  };
}