import { Project, Session } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://bandspace-app-b8372bfadc38.herokuapp.com/api";

class ApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;
  private refreshTokenPromise: Promise<void> | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  private isPublicEndpoint(endpoint: string): boolean {
    // Auth endpoints are public except logout
    if (endpoint.includes('/auth/')) {
      return !endpoint.includes('/auth/logout');
    }
    return false;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add existing headers if they exist
    if (options.headers) {
      const existingHeaders = new Headers(options.headers);
      existingHeaders.forEach((value, key) => {
        headers[key] = value;
      });
    }

    // Add authorization header for non-public endpoints
    if (!this.isPublicEndpoint(endpoint) && this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized - token expired
    if (response.status === 401 && !this.isPublicEndpoint(endpoint) && retryCount === 0) {
      try {
        await this.handleTokenRefresh();
        // Retry the request with new token
        return this.request<T>(endpoint, options, retryCount + 1);
      } catch (refreshError) {
        // Token refresh failed - let the auth context handle this
        throw new ApiError(401, "Authentication failed", refreshError);
      }
    }

    if (!response.ok) {
      const errorData: { message?: string } = await (
        response.json() as Promise<{ message?: string }>
      ).catch((): { message?: string } => ({}));
      throw new ApiError(
        response.status,
        errorData.message || response.statusText,
        errorData
      );
    }

    // Check if response has content to parse
    const contentType = response.headers.get("content-type");
    const contentLength = response.headers.get("content-length");

    // If no content or content-length is 0, return empty object
    if (contentLength === "0" || response.status === 204) {
      return {} as T;
    }

    // If content-type is not JSON, return empty object
    if (!contentType || !contentType.includes("application/json")) {
      return {} as T;
    }

    // Try to parse JSON, return empty object if it fails
    try {
      const text = await response.text();
      if (!text || text.trim() === "") {
        return {} as T;
      }
      return JSON.parse(text) as T;
    } catch (error) {
      console.warn("Failed to parse JSON response:", error);
      return {} as T;
    }
  }

  private async handleTokenRefresh(): Promise<void> {
    // If there's already a refresh in progress, wait for it
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    // Start a new refresh process
    this.refreshTokenPromise = this.tryRefreshTokenWithRetry();
    
    try {
      await this.refreshTokenPromise;
    } finally {
      this.refreshTokenPromise = null;
    }
  }

  private async tryRefreshTokenWithRetry(): Promise<void> {
    const maxRetries = 5;
    const retryDelay = 100; // milliseconds

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.tryRefreshToken();
        return; // Success - exit retry loop
      } catch (error) {
        if (attempt === maxRetries) {
          // Last attempt - throw error
          throw new Error(
            `Token refresh failed after ${maxRetries} attempts: ${error}`
          );
        }

        // Wait before next attempt (exponential backoff)
        await new Promise(resolve => 
          setTimeout(resolve, retryDelay * attempt)
        );
      }
    }
  }

  private async tryRefreshToken(): Promise<void> {
    const storedSession = localStorage.getItem("bandspace_session");
    if (!storedSession) {
      throw new Error("No session found");
    }

    const session: Session = JSON.parse(storedSession);
    if (!session.refreshToken) {
      throw new Error("No refresh token available");
    }

    // Use direct fetch to avoid interceptors during refresh
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Token refresh failed");
    }

    const newSession: Session = await response.json();
    
    // Update stored session
    localStorage.setItem("bandspace_session", JSON.stringify(newSession));
    
    // Update access token in memory
    this.setAccessToken(newSession.accessToken);

    // Dispatch event to notify auth context
    window.dispatchEvent(
      new CustomEvent("bandspace-session-updated", { 
        detail: newSession 
      })
    );
  }

  private async uploadRequest<T>(
    endpoint: string,
    formData: FormData,
    retryCount = 0
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {};

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });

    // Handle 401 Unauthorized - token expired
    if (response.status === 401 && retryCount === 0) {
      try {
        await this.handleTokenRefresh();
        // Retry the request with new token
        return this.uploadRequest<T>(endpoint, formData, retryCount + 1);
      } catch (refreshError) {
        // Token refresh failed - let the auth context handle this
        throw new ApiError(401, "Authentication failed", refreshError);
      }
    }

    if (!response.ok) {
      const errorData: { message?: string } = await (
        response.json() as Promise<{ message?: string }>
      ).catch((): { message?: string } => ({}));
      throw new ApiError(
        response.status,
        errorData.message || response.statusText,
        errorData
      );
    }

    return response.json() as Promise<T>;
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  // Google Web Flow - redirect to backend OAuth endpoint
  redirectToGoogleAuth() {
    const isDev =
      process.env.NODE_ENV === "development" ||
      window.location.hostname === "localhost";
    const devParam = isDev ? "?dev=true" : "";
    window.location.href = `${this.baseUrl}/auth/google${devParam}`;
  }

  // Google Mobile Flow - for mobile apps with ID token
  async googleLogin(token: string) {
    return this.request("/auth/google/mobile", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  }

  async register(email: string, password: string) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  async requestPasswordReset(email: string) {
    return this.request("/auth/password/request-reset", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string) {
    return this.request("/auth/password/reset", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request("/auth/change-password", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async refreshToken(refreshToken: string): Promise<Session> {
    return this.request("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  }

  // User endpoints
  async getUserMe() {
    return this.request("/users/me");
  }

  // Projects endpoints
  async getProjects(): Promise<Project[]> {
    return this.request("/projects");
  }

  async createProject(name: string): Promise<Project> {
    return this.request("/projects", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  }

  async getProject(projectId: number) {
    return this.request(`/projects/${projectId}`);
  }

  async updateProject(projectId: number, name: string) {
    return this.request(`/projects/${projectId}`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    });
  }

  async deleteProject(projectId: number) {
    return this.request(`/projects/${projectId}`, {
      method: "DELETE",
    });
  }

  // Songs endpoints
  async getProjectSongs(projectId: number) {
    return this.request(`/projects/${projectId}/songs`);
  }

  async uploadSong(projectId: number, formData: FormData) {
    return this.uploadRequest(`/projects/${projectId}/songs`, formData);
  }

  async updateSong(
    projectId: number,
    songId: number,
    updates: {
      title?: string;
      bpm?: number;
      lyrics?: string;
    }
  ) {
    return this.request(`/projects/${projectId}/songs/${songId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  async deleteSong(projectId: number, songId: number) {
    return this.request(`/projects/${projectId}/songs/${songId}`, {
      method: "DELETE",
    });
  }

  async getSongDownloadUrl(projectId: number, songId: number) {
    return this.request(`/projects/${projectId}/songs/${songId}/download`);
  }

  // Members and invitations
  async getProjectMembers(projectId: number) {
    return this.request(`/projects/${projectId}/members`);
  }

  async inviteUser(projectId: number, email: string) {
    return this.request(`/projects/${projectId}/invitations`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async getUserInvitations() {
    return this.request("/user/invitations");
  }

  async respondToInvitation(
    invitationId: number,
    action: "accept" | "decline"
  ) {
    return this.request(`/user/invitations/${invitationId}`, {
      method: "PATCH",
      body: JSON.stringify({ action }),
    });
  }
}

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
