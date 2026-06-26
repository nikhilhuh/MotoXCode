import { Router } from "express";
import multer from "multer";
import { cmsController } from "../controllers/cms.controller";
import { requireAuth, verifyAdminGate, optionalAuth } from "../middlewares/auth.middleware";

/**
 * CMS resource routes.
 * Mounted at: /api
 * Serves static/dynamic text and core presentation assets.
 * Mutation routes are guarded by requireAuth + verifyAdminGate.
 */
const cmsRouter = Router();

/** Multer instance — memory storage so file buffers go straight to Supabase. */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit max
});

// Read-only (public)
// GET /api/socials — fetch all social links
cmsRouter.get("/socials", cmsController.getSocials.bind(cmsController));
// GET /api/home — aggregated home page payload
cmsRouter.get("/home", optionalAuth as any, cmsController.getHomeData.bind(cmsController));
// GET /api/about — aggregated about page payload
cmsRouter.get("/about", cmsController.getAboutData.bind(cmsController));

// Admin Mutations (protected)
// PATCH /api/home/update-hero — swap the home page hero background image
cmsRouter.patch(
  "/home/update-hero",
  requireAuth as any,
  verifyAdminGate as any,
  upload.single("image"),
  cmsController.updateHeroData.bind(cmsController)
);

// PATCH /api/home/update-stat — edit multiple stat cards (bulk text + optional dynamic images)
cmsRouter.patch(
  "/home/update-stat",
  requireAuth as any,
  verifyAdminGate as any,
  upload.any(),
  cmsController.updateStatData.bind(cmsController)
);

// PATCH /api/home/update-value — edit multiple value blocks (bulk text + optional dynamic images)
cmsRouter.patch(
  "/home/update-value",
  requireAuth as any,
  verifyAdminGate as any,
  upload.any(),
  cmsController.updateValueData.bind(cmsController)
);

// PATCH /api/home/update-socials — edit social links
cmsRouter.patch(
  "/home/update-socials",
  requireAuth as any,
  verifyAdminGate as any,
  upload.any(),
  cmsController.updateSocialsData.bind(cmsController)
);

// POST /api/gallery — add a new gallery image
cmsRouter.post(
  "/gallery",
  requireAuth as any,
  verifyAdminGate as any,
  upload.single("image"),
  cmsController.addGalleryImage.bind(cmsController)
);

// DELETE /api/gallery/:id — delete a gallery image
cmsRouter.delete(
  "/gallery/:id",
  requireAuth as any,
  verifyAdminGate as any,
  cmsController.deleteGalleryImage.bind(cmsController)
);

// ─── Expanded CMS Mutation Routes (protected) ─────────────────────────────────

// PATCH /api/cms/hero — swap the hero backdrop for any page (about/crew/rides/events/contact/join)
cmsRouter.patch(
  "/cms/hero",
  requireAuth as any,
  verifyAdminGate as any,
  upload.single("image"),
  cmsController.updatePageHeroData.bind(cmsController)
);

// PATCH /api/cms/about — update philosophy quote/author/image + timeline entries
cmsRouter.patch(
  "/cms/about",
  requireAuth as any,
  verifyAdminGate as any,
  upload.single("image"),
  cmsController.updateAboutData.bind(cmsController)
);

// PATCH /api/cms/crew — update crew member bios, specs, and avatar images
cmsRouter.patch(
  "/cms/crew",
  requireAuth as any,
  verifyAdminGate as any,
  upload.any(),
  cmsController.updateCrewData.bind(cmsController)
);

// PATCH /api/cms/contact — update contact info items (no image assets)
cmsRouter.patch(
  "/cms/contact",
  requireAuth as any,
  verifyAdminGate as any,
  upload.none(),
  cmsController.updateContactData.bind(cmsController)
);

export { cmsRouter };
