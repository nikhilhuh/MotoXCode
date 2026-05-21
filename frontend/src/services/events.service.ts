import { AxiosResponse } from "axios";
import { apiClient } from "./apiClient";
import { fallbackData } from "./fallbackData";
import type { Event } from "../types/event";
import type { GalleryImage } from "../types/galleryImage";
import type { PageHero } from "./cms.service";

// ─── API Response Payload ─────────────────────────────────────────────────────

interface EventsApiResponse {
  success: boolean;
  data: {
    hero: PageHero;
    events: Event[];
    gallery: GalleryImage[];
  };
}

// ─── Return Type ──────────────────────────────────────────────────────────────

interface EventsPageData {
  hero: PageHero;
  events: Event[];
  galleryPreview: GalleryImage[];
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const eventsService = {
  async fetchEventsPageData(): Promise<EventsPageData> {
    try {
      const response: AxiosResponse<EventsApiResponse> =
        await apiClient.get<EventsApiResponse>("/events");
      const { hero, events, gallery } = response.data.data;
      return {
        hero,
        events,
        galleryPreview: gallery,
      };
    } catch {
      console.warn("Backend unreachable. Activating local fallback mode.");
      return { ...fallbackData.events };
    }
  },
};
