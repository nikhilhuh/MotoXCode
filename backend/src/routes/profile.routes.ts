import { Router } from "express";
import { profileController } from "../controllers/profile.controller";
import { requireAuth, verifyAdminGate } from "../middlewares/auth.middleware";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const profileRouter = Router();

// GET /api/profiles/:username - Get a user's profile by username
// requireAuth is applied as an optional interceptor — unauthenticated requests
// still pass through, but authenticated ones get richer data (e.g. strikes).
profileRouter.get(
  "/:username",
  (req, res, next) => {
    // Inject auth context if a Bearer token is present; otherwise skip silently.
    if (req.headers.authorization?.startsWith("Bearer ")) {
      return (requireAuth as any)(req, res, next);
    }
    next();
  },
  profileController.getProfile.bind(profileController)
);

// PUT /api/profiles/:username - Update the logged-in user's profile
profileRouter.put("/:username", requireAuth as any, profileController.updateProfile.bind(profileController));

// POST /api/profiles/:username/upload - Upload an image to the profile
profileRouter.post("/:username/upload", requireAuth as any, upload.single("file"), profileController.uploadImage.bind(profileController));

// DELETE /api/profiles/:username/image?type=avatar - Remove an image from the profile
profileRouter.delete("/:username/image", requireAuth as any, profileController.removeImage.bind(profileController));

// PUT /api/profiles/:username/change-email - Change the user's email with OTP verification
profileRouter.put("/:username/change-email", requireAuth as any, profileController.changeEmail.bind(profileController));

// Admin-Only Disciplinary & Role Mutation Routes
// PATCH /api/profiles/:username/strike — issue a disciplinary strike (riders only)
profileRouter.patch(
  "/:username/strike",
  requireAuth as any,
  verifyAdminGate as any,
  profileController.issueStrike.bind(profileController)
);

// PATCH /api/profiles/:username/strike-reduce — decrease or reset strike count
profileRouter.patch(
  "/:username/strike-reduce",
  requireAuth as any,
  verifyAdminGate as any,
  profileController.reduceStrike.bind(profileController)
);

// PATCH /api/profiles/:username/role — assign a new role tier (admin lock enforced)
profileRouter.patch(
  "/:username/role",
  requireAuth as any,
  verifyAdminGate as any,
  profileController.assignRole.bind(profileController)
);

export { profileRouter };
