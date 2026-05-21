import { Router } from "express";
import { ridesController } from "../controllers/rides.controller";

/**
 * Ride resource routes.
 * Mounted at: /api
 *
 * Operations for community rides, tracking, and media streams.
 */
const rideRouter = Router();

// GET /api/rides — aggregated rides page payload
rideRouter.get("/rides", ridesController.getRidesPageData.bind(ridesController));

export { rideRouter };
