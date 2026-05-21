import { AxiosResponse } from "axios";
import { apiClient } from "./apiClient";
import { fallbackData } from "./fallbackData";
import type { Ride } from "../types/ride";
import type { GalleryImage } from "../types/galleryImage";
import type { PageHero } from "./cms.service";

// ─── API Response Payload ─────────────────────────────────────────────────────

interface RidesApiResponse {
  success: boolean;
  data: {
    hero: PageHero;
    rides: Ride[];
    gallery: GalleryImage[];
  };
}

// ─── Return Type ──────────────────────────────────────────────────────────────

interface RidesPageData {
  hero: PageHero;
  allRides: Ride[];
  galleryPreview: GalleryImage[];
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const ridesService = {
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
};
