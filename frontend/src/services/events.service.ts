import { AxiosResponse } from "axios";
import { apiClient } from "./apiClient";
import { fallbackData } from "./fallbackData";
import type { Event } from "../types/event";
import type { GalleryImage } from "../types/galleryImage";
import type { PageHero } from "./cms.service";

// API Response Payloads
interface EventsApiResponse {
  success: boolean;
  data: {
    hero: PageHero;
    events: Event[];
    gallery: GalleryImage[];
  };
}

interface EventMutationApiResponse {
  success: boolean;
  message: string;
  data?: Event;
}

// Return Type
interface EventsPageData {
  hero: PageHero;
  allEvents: Event[];
  galleryPreview: GalleryImage[];
}

// Service
export const eventsService = {
  /**
   * GET /api/events
   * Fetches aggregated events page payload (hero, events list, gallery preview).
   * Falls back to local static data when the backend is unreachable.
   */
  async fetchEventsPageData(): Promise<EventsPageData> {
    try {
      const response: AxiosResponse<EventsApiResponse> =
        await apiClient.get<EventsApiResponse>("/events");
      const { hero, events, gallery } = response.data.data;
      return {
        hero,
        allEvents: events,
        galleryPreview: gallery,
      };
    } catch {
      console.warn("Backend unreachable. Activating local fallback mode.");
      return { ...fallbackData.events };
    }
  },

  /**
   * POST /api/events
   * Admin/Crew-only: creates a new event document.
   * Expects a FormData payload with an "image" file and all event text fields.
   * The apiClient interceptor automatically injects the Bearer token.
   */
  async createEvent(formData: FormData): Promise<Event> {
    const response: AxiosResponse<EventMutationApiResponse> =
      await apiClient.post<EventMutationApiResponse>("/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message ?? "Failed to create event.");
    }

    return response.data.data;
  },

  /**
   * PATCH /api/events/:id
   * Admin/Crew-only: updates an existing event document.
   * Expects a FormData payload; image field is optional (only provided when changing the image).
   */
  async updateEvent(id: string, formData: FormData): Promise<Event> {
    const response: AxiosResponse<EventMutationApiResponse> =
      await apiClient.patch<EventMutationApiResponse>(
        `/events/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message ?? "Failed to update event.");
    }

    return response.data.data;
  },

  /**
   * DELETE /api/events/:id
   * Admin/Crew-only: deletes a event document and its associated cloud image asset.
   */
  async deleteEvent(id: string): Promise<void> {
    const response: AxiosResponse<{ success: boolean; message: string }> =
      await apiClient.delete<{ success: boolean; message: string }>(
        `/events/${id}`,
      );

    if (!response.data.success) {
      throw new Error(response.data.message ?? "Failed to delete event.");
    }
  },

  /**
   * POST /api/events/:id/join
   * Authenticated users: join a event.
   */
  async joinEvent(id: string): Promise<EventMutationApiResponse> {
    const response: AxiosResponse<EventMutationApiResponse> =
      await apiClient.post(`/events/${id}/join`);
    return response.data;
  },

  /**
   * POST /api/events/:id/withdraw
   * Authenticated users: withdraw from a event.
   */
  async withdrawFromEvent(id: string): Promise<EventMutationApiResponse> {
    const response: AxiosResponse<EventMutationApiResponse> =
      await apiClient.post(`/events/${id}/withdraw`);
    return response.data;
  },
};
