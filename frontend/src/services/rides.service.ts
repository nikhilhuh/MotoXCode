import { AxiosResponse } from "axios";
import { apiClient } from "./apiClient";
import { fallbackData } from "./fallbackData";
import type { Ride } from "../types/ride";
import type { GalleryImage } from "../types/galleryImage";
import type { PageHero } from "./cms.service";

// ─── API Response Payloads ────────────────────────────────────────────────────

interface RidesApiResponse {
  success: boolean;
  data: {
    hero: PageHero;
    rides: Ride[];
    gallery: GalleryImage[];
  };
}

interface RideMutationApiResponse {
  success: boolean;
  message: string;
  data?: Ride;
}

// ─── Return Type ──────────────────────────────────────────────────────────────

interface RidesPageData {
  hero: PageHero;
  allRides: Ride[];
  galleryPreview: GalleryImage[];
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const ridesService = {
  /**
   * GET /api/rides
   * Fetches aggregated rides page payload (hero, rides list, gallery preview).
   * Falls back to local static data when the backend is unreachable.
   */
  async fetchRidesPageData(): Promise<RidesPageData> {
    try {
      const response: AxiosResponse<RidesApiResponse> =
        await apiClient.get<RidesApiResponse>("/rides");
      const { hero, rides, gallery } = response.data.data;
      return {
        hero,
        allRides: rides,
        galleryPreview: gallery,
      };
    } catch {
      console.warn("Backend unreachable. Activating local fallback mode.");
      return { ...fallbackData.rides };
    }
  },

  /**
   * POST /api/rides
   * Admin/Crew-only: creates a new ride document.
   * Expects a FormData payload with an "image" file and all ride text fields.
   * The apiClient interceptor automatically injects the Bearer token.
   */
  async createRide(formData: FormData): Promise<Ride> {
    const response: AxiosResponse<RideMutationApiResponse> =
      await apiClient.post<RideMutationApiResponse>("/rides", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message ?? "Failed to create ride.");
    }

    return response.data.data;
  },

  /**
   * PATCH /api/rides/:id
   * Admin/Crew-only: updates an existing ride document.
   * Expects a FormData payload; image field is optional (only provided when changing the image).
   */
  async updateRide(id: string, formData: FormData): Promise<Ride> {
    const response: AxiosResponse<RideMutationApiResponse> =
      await apiClient.patch<RideMutationApiResponse>(`/rides/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message ?? "Failed to update ride.");
    }

    return response.data.data;
  },

  /**
   * DELETE /api/rides/:id
   * Admin/Crew-only: deletes a ride document and its associated cloud image asset.
   */
  async deleteRide(id: string): Promise<void> {
    const response: AxiosResponse<{ success: boolean; message: string }> =
      await apiClient.delete<{ success: boolean; message: string }>(`/rides/${id}`);

    if (!response.data.success) {
      throw new Error(response.data.message ?? "Failed to delete ride.");
    }
  },

  /**
   * POST /api/rides/:id/join
   * Authenticated users: join a ride.
   */
  async joinRide(id: string): Promise<RideMutationApiResponse> {
    const response: AxiosResponse<RideMutationApiResponse> = await apiClient.post(
      `/rides/${id}/join`
    );
    return response.data;
  },

  /**
   * POST /api/rides/:id/withdraw
   * Authenticated users: withdraw from a ride.
   */
  async withdrawFromRide(id: string): Promise<RideMutationApiResponse> {
    const response: AxiosResponse<RideMutationApiResponse> = await apiClient.post(
      `/rides/${id}/withdraw`
    );
    return response.data;
  },
};
