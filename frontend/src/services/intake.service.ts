import { AxiosResponse } from "axios";
import { apiClient } from "./apiClient";
import { fallbackData } from "./fallbackData";
import type { ContactInfoItem } from "../types/contactInfo";
import type { ContactFormData } from "../types/contactForm";
import type { Membership } from "../types/membership";
import type { GalleryImage } from "../types/galleryImage";
import type { PageHero } from "./cms.service";

// API Response Payloads
interface ContactPageApiResponse {
  success: boolean;
  data: {
    hero: PageHero;
    contactInfo: ContactInfoItem[];
  };
}

interface JoinPageApiResponse {
  success: boolean;
  data: {
    hero: PageHero;
    gallery: GalleryImage[];
  };
}

interface FormSubmissionApiResponse {
  success: boolean;
  message: string;
}

// Return Types
interface ContactPageData {
  hero: PageHero;
  contactInfo: ContactInfoItem[];
}

interface JoinPageData {
  hero: PageHero;
  galleryPreview: GalleryImage[];
}

interface FormSubmissionResult {
  success: boolean;
  message: string;
}

// Service
export const intakeService = {
  async fetchContactPageData(): Promise<ContactPageData> {
    try {
      const response: AxiosResponse<ContactPageApiResponse> =
        await apiClient.get<ContactPageApiResponse>("/contact");
      return response.data.data;
    } catch {
      console.warn("Backend unreachable. Activating local fallback mode.");
      return { ...fallbackData.contact };
    }
  },

  async fetchJoinPageData(): Promise<JoinPageData> {
    try {
      const response: AxiosResponse<JoinPageApiResponse> =
        await apiClient.get<JoinPageApiResponse>("/join");
      const { hero, gallery } = response.data.data;
      return {
        hero,
        galleryPreview: gallery,
      };
    } catch {
      console.warn("Backend unreachable. Activating local fallback mode.");
      return { ...fallbackData.join };
    }
  },

  /**
   * POST handlers do not fall back to local data — form submissions
   * require a live backend. Errors are re-thrown for the UI to handle.
   */
  async submitContactForm(
    payload: ContactFormData
  ): Promise<FormSubmissionResult> {
    const response: AxiosResponse<FormSubmissionApiResponse> =
      await apiClient.post<FormSubmissionApiResponse>("/contact", payload);
    return {
      success: response.data.success,
      message: response.data.message,
    };
  },

  async submitJoinForm(payload: Membership): Promise<FormSubmissionResult> {
    const response: AxiosResponse<FormSubmissionApiResponse> =
      await apiClient.post<FormSubmissionApiResponse>("/join", payload);
    return {
      success: response.data.success,
      message: response.data.message,
    };
  },
};
