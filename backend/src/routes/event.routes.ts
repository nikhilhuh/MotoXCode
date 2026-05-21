import { Router } from "express";
import { eventsController } from "../controllers/events.controller";

/**
 * Event resource routes.
 * Mounted at: /api
 *
 * Operations for community events and media streams.
 */
const eventRouter = Router();

// GET /api/events — aggregated events page payload
eventRouter.get("/events", eventsController.getEventsPageData.bind(eventsController));

export { eventRouter };
