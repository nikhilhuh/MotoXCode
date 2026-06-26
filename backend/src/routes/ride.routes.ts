import { Router } from "express";
import multer from "multer";
import { ridesController } from "../controllers/rides.controller";
import { requireAuth, verifyAdminOrCrewGate, optionalAuth } from "../middlewares/auth.middleware";

/**
 * Ride resource routes.
 * Mounted at: /api
 *
 * Operations for community rides, tracking, and media streams.
 * Mutation routes are guarded by requireAuth + verifyAdminOrCrewGate.
 */
const rideRouter = Router();

/** Multer instance — memory storage so file buffers go straight to Supabase. */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

// ─── Read-only (public) ───────────────────────────────────────────────────────

// GET /api/rides — aggregated rides page payload
rideRouter.get(
  "/rides",
  optionalAuth as any,
  ridesController.getRidesPageData.bind(ridesController)
);

// ─── User Mutations (protected) ────────────────────────────────────────────────

// POST /api/rides/:id/join — authenticated user joins a ride
rideRouter.post(
  "/rides/:id/join",
  requireAuth as any,
  ridesController.joinRide.bind(ridesController)
);

// POST /api/rides/:id/withdraw — authenticated user withdraws from a ride
rideRouter.post(
  "/rides/:id/withdraw",
  requireAuth as any,
  ridesController.withdrawFromRide.bind(ridesController)
);

// ─── Admin / Crew Mutations (protected) ──────────────────────────────────────

// POST /api/rides — create a new ride document with image
rideRouter.post(
  "/rides",
  requireAuth as any,
  verifyAdminOrCrewGate as any,
  upload.single("image"),
  ridesController.createRide.bind(ridesController)
);

// PATCH /api/rides/:id — update ride fields and optionally swap the image
rideRouter.patch(
  "/rides/:id",
  requireAuth as any,
  verifyAdminOrCrewGate as any,
  upload.single("image"),
  ridesController.updateRide.bind(ridesController)
);

// DELETE /api/rides/:id — delete ride document and purge cloud image asset
rideRouter.delete(
  "/rides/:id",
  requireAuth as any,
  verifyAdminOrCrewGate as any,
  ridesController.deleteRide.bind(ridesController)
);

export { rideRouter };
