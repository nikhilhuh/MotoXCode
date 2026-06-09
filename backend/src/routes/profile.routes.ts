import { Router } from "express";
import { profileController } from "../controllers/profile.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const profileRouter = Router();

// GET /api/profiles/:username - Get a user's profile by username
profileRouter.get("/:username", profileController.getProfile.bind(profileController));

// PUT /api/profiles/:username - Update the logged-in user's profile
profileRouter.put("/:username", requireAuth as any, profileController.updateProfile.bind(profileController));

// POST /api/profiles/:username/upload - Upload an image to the profile
profileRouter.post("/:username/upload", requireAuth as any, upload.single("file"), profileController.uploadImage.bind(profileController));

// DELETE /api/profiles/:username/image?type=avatar - Remove an image from the profile
profileRouter.delete("/:username/image", requireAuth as any, profileController.removeImage.bind(profileController));

// PUT /api/profiles/:username/change-email - Change the user's email with OTP verification
profileRouter.put("/:username/change-email", requireAuth as any, profileController.changeEmail.bind(profileController));

export { profileRouter };
