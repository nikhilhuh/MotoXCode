import { AxiosResponse } from "axios";
import { apiClient } from "./apiClient";

import type { Member } from "../types/member";
import type { PageHero } from "./cms.service";

// API Response Payload
interface CrewApiResponse {
  success: boolean;
  data: {
    hero: PageHero;
    mvpMembers: Member[];
    normalMembers: Member[];
  };
}

// Return Type
interface CrewData {
  hero: PageHero;
  mvpMembers: Member[];
  normalMembers: Member[];
}

// Service
export const crewService = {
  async fetchCrewData(): Promise<CrewData> {
    const response: AxiosResponse<CrewApiResponse> =
      await apiClient.get<CrewApiResponse>("/crew");
    return response.data.data;
  },
};
