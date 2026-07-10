import { Router } from "express";
import multer from "multer";
import { eventsController } from "../controllers/events.controller";
import { requireAuth, optionalAuth, verifyAdminOrCrewGate } from "../middlewares/auth.middleware";

/**
 * Event resource routes.
 * Mounted at: /api
 *
 * Operations for community events and media streams.
 */
const eventRouter = Router();

/** Multer instance — memory storage so file buffers go straight to Supabase. */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

// GET /api/events — aggregated events page payload
eventRouter.get("/events", optionalAuth as any, eventsController.getEventsPageData.bind(eventsController));

// POST /api/events/:id/join — authenticated user joins an event
eventRouter.post("/events/:id/join", requireAuth as any, eventsController.joinEvent.bind(eventsController));

// POST /api/events/:id/withdraw — authenticated user withdraws from an event
eventRouter.post("/events/:id/withdraw", requireAuth as any, eventsController.withdrawFromEvent.bind(eventsController));

// Admin / Crew Mutations (protected)
// POST /api/events — create a new event document
eventRouter.post(
  "/events",
  requireAuth as any,
  verifyAdminOrCrewGate as any,
  upload.single("image"),
  eventsController.createEvent.bind(eventsController)
);

// PATCH /api/events/:id — update event fields
eventRouter.patch(
  "/events/:id",
  requireAuth as any,
  verifyAdminOrCrewGate as any,
  upload.single("image"),
  eventsController.updateEvent.bind(eventsController)
);

// DELETE /api/events/:id — delete event document
eventRouter.delete(
  "/events/:id",
  requireAuth as any,
  verifyAdminOrCrewGate as any,
  eventsController.deleteEvent.bind(eventsController)
);

export { eventRouter };
