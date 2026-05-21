/**
 * Centralized model barrel export.
 *
 * Import all Mongoose models and their TypeScript types from this single
 * entry point. Never import directly from individual model files in services.
 *
 * Usage:
 *   import { RideModel, IRideDocument } from '../models';
 *
 * ─── Ecosystem Map ──────────────────────────────────────────────────────────
 *
 *  Content CMS          → PageHero, Stat, Value, Philosophy,
 *                         Social, RidingCode, Timeline, ContactInfo
 *  Community Operations → Ride, Member, Event, Gallery
 *  User Intake Pipeline → Membership, Contact
 */

// ─── Content CMS ─────────────────────────────────────────────────────────────

export { PageHeroModel, IPageHero, PageHeroPage } from "./PageHero";
export { StatModel, IStatDocument } from "./Stat";
export { ValueModel, IValueDocument } from "./Value";
export { PhilosophyModel, IPhilosophyDocument } from "./Philosophy";
export { SocialModel, ISocialDocument } from "./Social";
export { RidingCodeModel, IRidingCodeDocument } from "./RidingCode";
export { TimelineModel, ITimelineDocument } from "./Timeline";
export { ContactInfoModel, IContactInfoDocument } from "./ContactInfo";

// ─── Community Operations ─────────────────────────────────────────────────────

export { RideModel, IRideDocument, RouteType } from "./Ride";
export { MemberModel, IMemberDocument } from "./Member";
export { EventModel, IEventDocument, EventType } from "./Event";
export { GalleryModel, IGalleryDocument, GalleryPageType } from "./Gallery";

// ─── User Intake Pipeline ─────────────────────────────────────────────────────

export { MembershipModel, IMembershipDocument, ApplicationStatus } from "./Membership";
export { ContactModel, IContactDocument } from "./Contact";

// ─── Legacy (remove when demo route is replaced) ──────────────────────────────

export { DemoModel, IDemoDocument } from "./demo.model";
