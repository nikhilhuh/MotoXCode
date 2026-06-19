import { Request, Response, NextFunction } from "express";
import { Member } from "../models";
import { VerificationToken } from "../models/VerificationToken";
import { comparePassword } from "../services/auth.service";
import { AppError } from "../middlewares/error.middleware";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { supabaseStorageService } from "../services/supabaseStorage.service";

// ─── Admin Action Response Shapes ─────────────────────────────────────────────

interface StrikeActionResponse {
  success: boolean;
  message: string;
  strikes: number;
}

interface RoleAssignResponse {
  success: boolean;
  message: string;
  role: "crew" | "admin" | "rider";
  strikes: number;
}

const computeProfileCompleted = (doc: any): boolean => {
  return !!(
    doc.username &&
    doc.email &&
    doc.coverImage &&
    doc.avatar &&
    doc.name &&
    doc.headline &&
    doc.bio &&
    doc.years !== undefined && doc.years !== null &&
    doc.location &&
    doc.bike && Array.isArray(doc.bike) && doc.bike.length > 0 &&
    (doc.instagram ||
    doc.youtube ||
    doc.facebook) &&
    doc.googleConnected
  );
};

export class ProfileController {
  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username } = req.params;

      // Privacy Matrix: expose strikes ONLY to admins or the profile owner.
      // We check self by looking up the requester's username to avoid a second query on the profile doc.
      const isAdmin = req.user?.role === "admin";
      let isSelf = false;
      if (req.user && !isAdmin) {
        const requester = await Member.findById(req.user._id).select("username").lean();
        isSelf = requester?.username === username;
      }

      // Build select string conditionally — avoids query variable reassignment
      // that would break Mongoose's generic type inference.
      const selectFields = [
        "_id", "username", "name", "headline", "bio", "years", "location",
        "bike", "instagram", "youtube", "facebook", "avatar", "coverImage",
        "profileCompleted", "role",
        ...(isAdmin || isSelf ? ["strikes"] : []),
      ].join(" ");

      const profile = await Member.findOne({ username }).select(selectFields).lean();
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
      
      const allowedFields = ["username", "name", "headline", "bio", "years", "location", "bike", "instagram", "youtube", "facebook"];
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
        let updated = await Member.findByIdAndUpdate(req.user._id, updateData, { new: true }).select("-_id -password").lean();
        const isCompleted = computeProfileCompleted(updated);
        if (updated && updated.profileCompleted !== isCompleted) {
          updated = await Member.findByIdAndUpdate(req.user._id, { profileCompleted: isCompleted }, { new: true }).select("-_id -password").lean();
        }
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

      let updated = await Member.findByIdAndUpdate(
        req.user._id,
        { [type]: publicUrl },
        { new: true }
      ).select("-_id -password").lean();

      const isCompleted = computeProfileCompleted(updated);
      if (updated && updated.profileCompleted !== isCompleted) {
        updated = await Member.findByIdAndUpdate(req.user._id, { profileCompleted: isCompleted }, { new: true }).select("-_id -password").lean();
      }

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

      let updated = await Member.findByIdAndUpdate(
        req.user._id,
        { [type]: "" },
        { new: true }
      ).select("-_id -password").lean();

      const isCompleted = computeProfileCompleted(updated);
      if (updated && updated.profileCompleted !== isCompleted) {
        updated = await Member.findByIdAndUpdate(req.user._id, { profileCompleted: isCompleted }, { new: true }).select("-_id -password").lean();
      }

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

      let updated = await Member.findByIdAndUpdate(
        req.user._id,
        { email: newEmail, updatedAt: new Date() },
        { new: true }
      ).select("-_id -password").lean();

      const isCompleted = computeProfileCompleted(updated);
      if (updated && updated.profileCompleted !== isCompleted) {
        updated = await Member.findByIdAndUpdate(req.user._id, { profileCompleted: isCompleted }, { new: true }).select("-_id -password").lean();
      }

      res.status(200).json({ success: true, message: "Email updated successfully.", profile: updated });
    } catch (err) {
      next(err);
    }
  }

  // ─── Administrative Disciplinary Handlers ─────────────────────────────────

  /**
   * PATCH /api/profiles/:username/strike
   * Admin-only: Atomically increments the strike count by 1.
   *
   * Pre-flight guard: Crew and admin ranks are immune to disciplinary strikes.
   * Rejects with 403 if the target member holds an elevated role.
   */
  async issueStrike(
    req: AuthenticatedRequest,
    res: Response<StrikeActionResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username } = req.params;
      const target = await Member.findOne({ username }).select("_id role strikes").lean();
      if (!target) throw new AppError("Profile not found", 404);

      if (target.role === "admin" || target.role === "crew") {
        res.status(403).json({
          success: false,
          message: "Disciplinary strikes cannot be issued to administrative crew ranks.",
          strikes: target.strikes ?? 0,
        });
        return;
      }

      // ── Strike cap enforcement: maximum of 3 strikes per member ──
      const currentStrikes = target.strikes ?? 0;
      if (currentStrikes >= 3) {
        res.status(400).json({
          success: false,
          message: "Strike cap reached. This member already holds the maximum of 3 disciplinary strikes.",
          strikes: currentStrikes,
        });
        return;
      }

      const updated = await Member.findByIdAndUpdate(
        target._id,
        { $inc: { strikes: 1 } },
        { new: true }
      ).select("+strikes").lean();

      res.status(200).json({
        success: true,
        message: "Strike issued successfully.",
        strikes: updated?.strikes ?? 0,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/profiles/:username/strike-reduce
   * Admin-only: Decrements or resets the strike count.
   *
   * Body: { action: "decrease" | "reset" }
   *   "decrease" — subtracts 1, floor enforced at 0 via $max operator
   *   "reset"    — sets strikes directly to 0
   */
  async reduceStrike(
    req: AuthenticatedRequest,
    res: Response<StrikeActionResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username } = req.params;
      const action = req.body.action as "decrease" | "reset";

      if (action !== "decrease" && action !== "reset") {
        res.status(400).json({
          success: false,
          message: "Invalid action. Must be 'decrease' or 'reset'.",
          strikes: 0,
        });
        return;
      }

      const target = await Member.findOne({ username }).select("_id strikes").lean();
      if (!target) throw new AppError("Profile not found", 404);

      let updateOp: object;
      if (action === "decrease") {
        // Decrement by 1, but use $max to enforce the 0 floor after the update
        const newCount = Math.max(0, (target.strikes ?? 0) - 1);
        updateOp = { $set: { strikes: newCount } };
      } else {
        updateOp = { $set: { strikes: 0 } };
      }

      const updated = await Member.findByIdAndUpdate(
        target._id,
        updateOp,
        { new: true }
      ).select("+strikes").lean();

      res.status(200).json({
        success: true,
        message: action === "decrease" ? "Strike reduced successfully." : "Strike record cleared.",
        strikes: updated?.strikes ?? 0,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/profiles/:username/role
   * Admin-only: Assigns a new role tier to the target member.
   *
   * Immutability Guard: If the target already holds the "admin" role, the
   * operation is permanently blocked — only direct DB manipulation can change it.
   *
   * Automatic Mitigation: Promotion to "admin" or "crew" atomically resets
   * the strikes counter to 0.
   */
  async assignRole(
    req: AuthenticatedRequest,
    res: Response<RoleAssignResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username } = req.params;
      const newRole = req.body.role as "crew" | "admin" | "rider";

      if (!newRole || !["crew", "admin", "rider"].includes(newRole)) {
        res.status(400).json({
          success: false,
          message: "Invalid role. Must be one of: 'crew', 'admin', 'rider'.",
          role: newRole,
          strikes: 0,
        });
        return;
      }

      const target = await Member.findOne({ username }).select("_id role strikes").lean();
      if (!target) throw new AppError("Profile not found", 404);

      // ── Absolute Admin Immutability Lock ──────────────────────────────────
      if (target.role === "admin") {
        res.status(403).json({
          success: false,
          message:
            "Administrative lock active. Existing Admin roles cannot be mutated via application routing and must be handled via direct database management.",
          role: "admin",
          strikes: target.strikes ?? 0,
        });
        return;
      }

      // ── Automatic Strike Mitigation on Elevation ──────────────────────────
      const updatePayload: { role: string; strikes?: number } = { role: newRole };
      if (newRole === "admin" || newRole === "crew") {
        updatePayload.strikes = 0;
      }

      const updated = await Member.findByIdAndUpdate(
        target._id,
        { $set: updatePayload },
        { new: true }
      ).select("+strikes role").lean();

      res.status(200).json({
        success: true,
        message: `Role updated to '${newRole}' successfully.`,
        role: updated?.role as "crew" | "admin" | "rider",
        strikes: updated?.strikes ?? 0,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const profileController = new ProfileController();
