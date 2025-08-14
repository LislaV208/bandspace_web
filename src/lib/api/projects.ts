import apiClient from './client';
import type { Project, CreateProjectRequest, UpdateProjectRequest, ProjectMember, Invitation } from '../types/project';

export const projectsAPI = {
  getProjects: async (): Promise<Project[]> => {
    const response = await apiClient.get('/projects');
    return response.data;
  },

  getProject: async (id: string): Promise<Project> => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (projectData: CreateProjectRequest): Promise<Project> => {
    const response = await apiClient.post('/projects', projectData);
    return response.data;
  },

  updateProject: async (id: string, projectData: UpdateProjectRequest): Promise<Project> => {
    const response = await apiClient.patch(`/projects/${id}`, projectData);
    return response.data;
  },

  deleteProject: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },

  getMembers: async (id: string): Promise<ProjectMember[]> => {
    const response = await apiClient.get(`/projects/${id}/members`);
    return response.data;
  },

  leaveProject: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}/members/me`);
  },

  inviteUser: async (projectId: string, email: string): Promise<void> => {
    await apiClient.post(`/projects/${projectId}/invitations`, { email });
  },

  getInvitations: async (): Promise<Invitation[]> => {
    const response = await apiClient.get('/user/invitations');
    return response.data;
  },

  acceptInvitation: async (invitationId: string): Promise<void> => {
    await apiClient.post(`/invitations/${invitationId}/accept`);
  },

  rejectInvitation: async (invitationId: string): Promise<void> => {
    await apiClient.post(`/invitations/${invitationId}/reject`);
  },
};