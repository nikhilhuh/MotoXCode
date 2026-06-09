import { Request, Response, NextFunction } from "express";
import { Member } from "../models";
import { VerificationToken } from "../models/VerificationToken";
import { comparePassword } from "../services/auth.service";
import { AppError } from "../middlewares/error.middleware";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { supabaseStorageService } from "../services/supabaseStorage.service";

export class ProfileController {
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username } = req.params;
      const profile = await Member.findOne({ username })
        .select("username name headline bio years location bike instagram youtube facebook avatar coverImage")
        .lean();
      if (!profile) {
        throw new AppError("Profile not found", 404);
      }
      res.status(200).json({ success: true, profile });
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AppError("Unauthorized", 401);
      
      const { username } = req.params;
      const targetProfile = await Member.findOne({ username });
      if (!targetProfile) throw new AppError("Profile not found", 404);

      if ((targetProfile as any)._id.toString() !== req.user._id.toString()) {
        throw new AppError("Forbidden: You can only modify your own profile", 403);
      }
      
      const allowedFields = ["username", "name", "headline", "bio", "years", "location", "bike", "instagram", "youtube", "facebook", "profileCompleted"];
      const updateData: any = {};
      
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          if (field === "username") {
            updateData[field] = req.body[field].trim().toLowerCase();
          } else {
            updateData[field] = req.body[field];
          }
        }
      }

      try {
        const updated = await Member.findByIdAndUpdate(req.user._id, updateData, { new: true }).select("-password").lean();
        res.status(200).json({ success: true, profile: updated });
      } catch (e: any) {
        if (e.code === 11000 && e.keyPattern && e.keyPattern.username) {
          throw new AppError("Username is already taken", 400);
        }
        throw e;
      }
    } catch (err) {
      next(err);
    }
  }

  async uploadImage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AppError("Unauthorized", 401);
      if (!req.file) throw new AppError("No file uploaded", 400);

      const { username } = req.params;
      const targetProfile = await Member.findOne({ username });
      if (!targetProfile) throw new AppError("Profile not found", 404);

      if ((targetProfile as any)._id.toString() !== req.user._id.toString()) {
        throw new AppError("Forbidden: You can only modify your own profile", 403);
      }

      const type = req.body.type; // 'avatar' or 'coverImage'
      if (type !== "avatar" && type !== "coverImage") {
        throw new AppError("Invalid image type. Must be 'avatar' or 'coverImage'", 400);
      }

      const oldUrl = type === "avatar" ? targetProfile.avatar : targetProfile.coverImage;
      if (oldUrl) {
        try {
          const urlParts = oldUrl.split("/public/images/");
          if (urlParts.length === 2) {
            const oldPath = urlParts[1];
            await supabaseStorageService.deleteFileFromBucket("images", oldPath);
          }
        } catch (e) {
          console.error("Failed to delete old image from Supabase", e);
        }
      }

      const bucketName = "images"; // Assumes this Supabase bucket exists
      const timestamp = Date.now();
      const ext = req.file.originalname.split(".").pop() || "jpg";
      const destinationPath = `profiles/${req.user._id}/${type}_${timestamp}.${ext}`;

      const publicUrl = await supabaseStorageService.uploadFileToBucket(
        bucketName,
        destinationPath,
        req.file.buffer,
        req.file.mimetype
      );

      const updated = await Member.findByIdAndUpdate(
        req.user._id,
        { [type]: publicUrl },
        { new: true }
      ).select("-password").lean();

      res.status(200).json({ success: true, url: publicUrl, profile: updated });
    } catch (err) {
      next(err);
    }
  }

  async removeImage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AppError("Unauthorized", 401);

      const { username } = req.params;
      const targetProfile = await Member.findOne({ username });
      if (!targetProfile) throw new AppError("Profile not found", 404);

      if ((targetProfile as any)._id.toString() !== req.user._id.toString()) {
        throw new AppError("Forbidden: You can only modify your own profile", 403);
      }

      const type = req.query.type as string; // 'avatar' or 'coverImage'
      if (type !== "avatar" && type !== "coverImage") {
        throw new AppError("Invalid image type. Must be 'avatar' or 'coverImage'", 400);
      }

      const oldUrl = type === "avatar" ? targetProfile.avatar : targetProfile.coverImage;
      if (oldUrl) {
        try {
          const urlParts = oldUrl.split("/public/images/");
          if (urlParts.length === 2) {
            const oldPath = urlParts[1];
            await supabaseStorageService.deleteFileFromBucket("images", oldPath);
          }
        } catch (e) {
          console.error("Failed to delete old image from Supabase", e);
        }
      }

      const updated = await Member.findByIdAndUpdate(
        req.user._id,
        { [type]: "" },
        { new: true }
      ).select("-password").lean();

      res.status(200).json({ success: true, profile: updated });
    } catch (err) {
      next(err);
    }
  }

  async changeEmail(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AppError("Unauthorized", 401);
      
      const { username } = req.params;
      const targetProfile = await Member.findOne({ username });
      if (!targetProfile) throw new AppError("Profile not found", 404);

      if ((targetProfile as any)._id.toString() !== req.user._id.toString()) {
        throw new AppError("Forbidden: You can only modify your own profile", 403);
      }

      const newEmail = req.body.newEmail?.trim().toLowerCase();
      const otp = req.body.otp;

      if (!newEmail || !otp) {
        throw new AppError("Email and OTP are required", 400);
      }

      const existingUser = await Member.findOne({ email: newEmail });
      if (existingUser) {
        throw new AppError("An account with that email already exists.", 409);
      }

      const tokenRecord = await VerificationToken.findOne({ email: newEmail });
      if (!tokenRecord) {
        throw new AppError("OTP has expired or was never requested. Please request a new one.", 400);
      }

      if (tokenRecord.expiresAt < new Date()) {
        await tokenRecord.deleteOne();
        throw new AppError("OTP has expired. Please request a new one.", 400);
      }

      const isMatch = await comparePassword(otp, tokenRecord.otp);
      if (!isMatch) {
        throw new AppError("Invalid OTP. Please check your email and try again.", 401);
      }

      await tokenRecord.deleteOne();

      const updated = await Member.findByIdAndUpdate(
        req.user._id,
        { email: newEmail, updatedAt: new Date() },
        { new: true }
      ).select("-password").lean();

      res.status(200).json({ success: true, message: "Email updated successfully.", profile: updated });
    } catch (err) {
      next(err);
    }
  }
}

export const profileController = new ProfileController();
