const API_BASE_URL = "https://bandspace-app-b8372bfadc38.herokuapp.com/api"

class ApiClient {
  private baseUrl: string
  private accessToken: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setAccessToken(token: string) {
    this.accessToken = token
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.message || response.statusText, errorData)
    }

    return response.json()
  }

  private async uploadRequest<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {}

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.message || response.statusText, errorData)
    }

    return response.json()
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async googleLogin(token: string) {
    return this.request("/auth/google/mobile", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
  }

  async register(email: string, password: string) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    })
  }

  async requestPasswordReset(email: string) {
    return this.request("/auth/password/request-reset", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  }

  async resetPassword(token: string, newPassword: string) {
    return this.request("/auth/password/reset", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    })
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request("/auth/change-password", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  }

  // Projects endpoints
  async getProjects() {
    return this.request("/projects")
  }

  async createProject(name: string, description?: string) {
    return this.request("/projects", {
      method: "POST",
      body: JSON.stringify({ name, description }),
    })
  }

  async getProject(projectId: number) {
    return this.request(`/projects/${projectId}`)
  }

  async updateProject(projectId: number, name: string) {
    return this.request(`/projects/${projectId}`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    })
  }

  async deleteProject(projectId: number) {
    return this.request(`/projects/${projectId}`, {
      method: "DELETE",
    })
  }

  // Songs endpoints
  async getProjectSongs(projectId: number) {
    return this.request(`/projects/${projectId}/songs`)
  }

  async uploadSong(projectId: number, formData: FormData) {
    return this.uploadRequest(`/projects/${projectId}/songs`, formData)
  }

  async updateSong(
    projectId: number,
    songId: number,
    updates: {
      title?: string
      bpm?: number
      lyrics?: string
    },
  ) {
    return this.request(`/projects/${projectId}/songs/${songId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    })
  }

  async deleteSong(projectId: number, songId: number) {
    return this.request(`/projects/${projectId}/songs/${songId}`, {
      method: "DELETE",
    })
  }

  async getSongDownloadUrl(projectId: number, songId: number) {
    return this.request(`/projects/${projectId}/songs/${songId}/download`)
  }

  // Members and invitations
  async getProjectMembers(projectId: number) {
    return this.request(`/projects/${projectId}/members`)
  }

  async inviteUser(projectId: number, email: string) {
    return this.request(`/projects/${projectId}/invitations`, {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  }

  async getUserInvitations() {
    return this.request("/user/invitations")
  }

  async respondToInvitation(invitationId: number, action: "accept" | "decline") {
    return this.request(`/user/invitations/${invitationId}`, {
      method: "PATCH",
      body: JSON.stringify({ action }),
    })
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
