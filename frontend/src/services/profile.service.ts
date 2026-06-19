import { AxiosResponse } from "axios";
import { apiClient } from "./apiClient";
import type { Profile } from "../types/profile";

interface ProfileApiResponse {
  success: boolean;
  profile: Profile;
}

interface ImageUploadResponse {
  success: boolean;
  url: string;
  profile: Profile;
}

interface StrikeActionResponse {
  success: boolean;
  message: string;
  strikes: number;
}

interface RoleAssignResponse {
  success: boolean;
  message: string;
  role: "crew" | "admin" | "rider";
  strikes: number;
}

export const profileService = {
  async getProfile(username: string): Promise<Profile> {
    const response: AxiosResponse<ProfileApiResponse> = await apiClient.get<ProfileApiResponse>(`/profiles/${username}`);
    return response.data.profile;
  },

  async updateProfile(username: string, updates: Partial<Profile>): Promise<Profile> {
    const response: AxiosResponse<ProfileApiResponse> = await apiClient.put<ProfileApiResponse>(`/profiles/${username}`, updates);
    return response.data.profile;
  },

  async uploadImage(username: string, file: File, type: "avatar" | "coverImage"): Promise<ImageUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    
    const response: AxiosResponse<ImageUploadResponse> = await apiClient.post<ImageUploadResponse>(
      `/profiles/${username}/upload`, 
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },

  async removeImage(username: string, type: "avatar" | "coverImage"): Promise<ProfileApiResponse> {
    const response: AxiosResponse<ProfileApiResponse> = await apiClient.delete<ProfileApiResponse>(`/profiles/${username}/image?type=${type}`);
    return response.data;
  },

  async changeEmail(username: string, newEmail: string, otp: string): Promise<ProfileApiResponse> {
    const response: AxiosResponse<ProfileApiResponse> = await apiClient.put<ProfileApiResponse>(`/profiles/${username}/change-email`, { newEmail, otp });
    return response.data;
  },

  // ─── Administrative Disciplinary & Role Methods ───────────────────────────

  /**
   * Issues a disciplinary strike to a rider account.
   * Returns 403 if the target is crew/admin (server enforces this too).
   */
  async issueStrike(username: string): Promise<StrikeActionResponse> {
    const response: AxiosResponse<StrikeActionResponse> = await apiClient.patch<StrikeActionResponse>(
      `/profiles/${username}/strike`
    );
    return response.data;
  },

  /**
   * Decreases or resets the disciplinary strike count.
   * @param action "decrease" subtracts 1 (floor 0), "reset" sets to 0.
   */
  async reduceStrike(username: string, action: "decrease" | "reset"): Promise<StrikeActionResponse> {
    const response: AxiosResponse<StrikeActionResponse> = await apiClient.patch<StrikeActionResponse>(
      `/profiles/${username}/strike-reduce`,
      { action }
    );
    return response.data;
  },

  /**
   * Assigns a new role tier to a member account.
   * Admin accounts are permanently locked — server rejects with 403.
   * Promotion to crew/admin automatically resets strikes to 0.
   */
  async assignRole(username: string, role: "crew" | "admin" | "rider"): Promise<RoleAssignResponse> {
    const response: AxiosResponse<RoleAssignResponse> = await apiClient.patch<RoleAssignResponse>(
      `/profiles/${username}/role`,
      { role }
    );
    return response.data;
  },
};

