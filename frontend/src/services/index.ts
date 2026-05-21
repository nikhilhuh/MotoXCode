/**
 * Centralized barrel export for all API service modules.
 *
 * Components can import any service method from a single entry point:
 *
 *   import { cmsService, crewService, ridesService, eventsService, intakeService } from '@/services';
 *
 * Or destructure individual methods:
 *
 *   import { cmsService } from '@/services';
 *   const data = await cmsService.fetchHomeData();
 */

// ─── Core Client ──────────────────────────────────────────────────────────────

export { apiClient } from "./apiClient";

// ─── Fallback Data ────────────────────────────────────────────────────────────

export { fallbackData } from "./fallbackData";

// ─── Page Service Modules ─────────────────────────────────────────────────────

export { cmsService } from "./cms.service";
export { crewService } from "./crew.service";
export { ridesService } from "./rides.service";
export { eventsService } from "./events.service";
export { intakeService } from "./intake.service";

// ─── Shared Types ─────────────────────────────────────────────────────────────

export type { PageHero } from "./cms.service";
