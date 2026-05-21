import { AxiosResponse } from "axios";
import { apiClient } from "./apiClient";
import { fallbackData } from "./fallbackData";
import type { Social } from "../types/social";
import type { Stat } from "../types/stat";
import type { Value } from "../types/value";
import type { Ride } from "../types/ride";
import type { Member } from "../types/member";
import type { GalleryImage } from "../types/galleryImage";
import type { Philosophy } from "../types/philosophy";
import type { Timeline } from "../types/timeline";
import type { RidingCode } from "../types/ridingCode";

// ─── PageHero Shape ───────────────────────────────────────────────────────────

export interface PageHero {
  page: string;
  image: string;
}

// ─── API Response Payloads ────────────────────────────────────────────────────

interface SocialsApiResponse {
  success: boolean;
  data: Social[];
}

interface HomeApiResponse {
  success: boolean;
  data: {
    hero: PageHero;
    stats: Stat[];
    values: Value[];
    upcomingRides: Ride[];
    mvpMembers: Member[];
    gallery: GalleryImage[];
  };
}

interface AboutApiResponse {
  success: boolean;
  data: {
    hero: PageHero;
    philosophies: Philosophy[];
    timeline: Timeline[];
    ridingCodes: RidingCode[];
  };
}

// ─── Return Types ─────────────────────────────────────────────────────────────

interface HomeData {
  hero: PageHero;
  stats: Stat[];
  values: Value[];
  upcomingRides: Ride[];
  mvpCrew: Member[];
  galleryPreview: GalleryImage[];
}

interface AboutData {
  hero: PageHero;
  philosophy: Philosophy[];
  timeline: Timeline[];
  ridingCode: RidingCode[];
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const cmsService = {
  async fetchSocials(): Promise<Social[]> {
    try {
      const response: AxiosResponse<SocialsApiResponse> =
        await apiClient.get<SocialsApiResponse>("/socials");
      return response.data.data;
    } catch {
      console.warn("Backend unreachable. Activating local fallback mode.");
      return [...fallbackData.socials];
    }
  },

  async fetchHomeData(): Promise<HomeData> {
    try {
      const response: AxiosResponse<HomeApiResponse> =
        await apiClient.get<HomeApiResponse>("/home");
      const { hero, stats, values, upcomingRides, mvpMembers, gallery } =
        response.data.data;
      return {
        hero,
        stats,
        values,
        upcomingRides,
        mvpCrew: mvpMembers,
        galleryPreview: gallery,
      };
    } catch {
      console.warn("Backend unreachable. Activating local fallback mode.");
      return { ...fallbackData.home };
    }
  },

  async fetchAboutData(): Promise<AboutData> {
    try {
      const response: AxiosResponse<AboutApiResponse> =
        await apiClient.get<AboutApiResponse>("/about");
      const { hero, philosophies, timeline, ridingCodes } = response.data.data;
      return {
        hero,
        philosophy: philosophies,
        timeline,
        ridingCode: ridingCodes,
      };
    } catch {
      console.warn("Backend unreachable. Activating local fallback mode.");
      return { ...fallbackData.about };
    }
  },
};
