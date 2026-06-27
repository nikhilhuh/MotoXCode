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

// PageHero Shape
export interface PageHero {
  _id: string;
  page: string;
  image: string;
}

// API Response Payloads
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

// Return Types
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

// CMS Mutation Response Types
interface CmsMutationResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

// Service
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

  /**
   * PATCH /api/home/update-{section}
   *
   * Ships a FormData payload containing text fields and/or a compressed
   * image binary to the admin-protected CMS mutation endpoint.
   *
   * The global apiClient interceptor automatically attaches the Bearer
   * token — no manual header wiring required here.
   *
   * @param section - The section name: "hero" | "stat" | "value"
   * @param payload - FormData container holding all mutation data
   */
  async updateHomeCMSData(
    section: string,
    payload: FormData
  ): Promise<{ success: boolean; message: string; data?: unknown }> {
    // Ensure the request hits your flat single-layer api endpoint path mapping
    const response = await apiClient.patch<{ success: boolean; message: string; data?: unknown }>(
      `/home/update-${section}`, 
      payload, 
      {
        headers: { 
          "Content-Type": "multipart/form-data" 
        }
      }
    );
    return response.data;
  },

  async addGalleryImage(
    payload: FormData
  ): Promise<{ success: boolean; message: string; data?: GalleryImage }> {
    const response = await apiClient.post<{ success: boolean; message: string; data?: GalleryImage }>(
      "/gallery",
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    return response.data;
  },

  async deleteGalleryImage(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `/gallery/${id}`
    );
    return response.data;
  },

  // Expanded CMS Mutation Methods
  /**
   * PATCH /api/cms/hero
   *
   * Swaps the hero backdrop image for any named page.
   * FormData must contain:
   *   - "image" binary key (compressed File)
   *   - "page"  string key (PageHeroPage enum value)
   *
   * @param payload - FormData with "image" binary + "page" string
   */
  async updatePageHeroCMSData(
    payload: FormData
  ): Promise<CmsMutationResponse> {
    const response = await apiClient.patch<CmsMutationResponse>(
      "/cms/hero",
      payload,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },

  /**
   * PATCH /api/cms/about
   *
   * Updates About page content — philosophy block and/or timeline entries.
   * FormData may contain:
   *   - "image"      binary key (compressed File, optional — replaces philosophy image)
   *   - "philosophy" JSON string: { id, quote?, author? }
   *   - "timeline"   JSON string: Array<{ id, year?, location?, event? }>
   *
   * @param payload - FormData with optional image + JSON text fields
   */
  async updateAboutCMSData(
    payload: FormData
  ): Promise<CmsMutationResponse> {
    const response = await apiClient.patch<CmsMutationResponse>(
      "/cms/about",
      payload,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },

  /**
   * PATCH /api/cms/crew
   *
   * Updates crew member display fields and/or avatar images.
   * FormData must contain:
   *   - "members"             JSON string: Array<{ username, name?, headline?, years?, location?, bike?, bio? }>
   *   - "avatar_<username>"   binary key per member whose avatar is being replaced (optional)
   *
   * @param payload - FormData with member JSON + optional per-member avatar binaries
   */
  async updateCrewCMSData(
    payload: FormData
  ): Promise<CmsMutationResponse> {
    const response = await apiClient.patch<CmsMutationResponse>(
      "/cms/crew",
      payload,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },

  /**
   * PATCH /api/cms/contact
   *
   * Updates contact info items (label, value, type) by _id.
   * FormData must contain:
   *   - "items" JSON string: Array<{ id, label?, value?, type? }>
   *
   * No binary file — multipart/form-data still used for consistency.
   *
   * @param payload - FormData with "items" JSON string
   */
  async updateContactCMSData(
    payload: FormData
  ): Promise<CmsMutationResponse> {
    const response = await apiClient.patch<CmsMutationResponse>(
      "/cms/contact",
      payload,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },
};
