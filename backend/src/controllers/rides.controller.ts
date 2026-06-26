import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import {
  PageHeroModel,
  IPageHero,
  RideModel,
  IRideDocument,
  GalleryModel,
  IGalleryDocument,
} from "../models";

// Response Shapes
interface RidesPageDataResponse {
  success: true;
  data: {
    hero: IPageHero | null;
    rides: IRideDocument[];
    gallery: IGalleryDocument[];
  };
}

interface RideMutationResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

// Ride Mutation Body Shape
interface RideBodyPayload {
  title?: string;
  locationFrom?: string;
  locationTo?: string;
  date?: string;
  distance?: string;
  routeType?: "Inter-state" | "Inter-city" | "Intra-city";
  meetupTime?: string;
  meetupLocation?: string;
  membersJoined?: string;
  description?: string;
  duration?: string;
  past?: string;
}

// Controller
const BUCKET = "images" as const;

/**
 * RidesController — serves community ride data, tracking info, and media, and exposes admin/crew mutation handlers for ride CRUD operations.
 */
export class RidesController {
  /**
   * GET /api/rides
   * Concurrently fetches the rides page hero, all rides, and rides gallery.
   */
  async getRidesPageData(
    req: AuthenticatedRequest,
    res: Response<RidesPageDataResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const isAdminOrCrew = req.user?.role === "admin" || req.user?.role === "crew";

      let ridesQuery = RideModel.find();
      
      if (isAdminOrCrew) {
        ridesQuery = ridesQuery.populate("riders", "username -_id");
      }

      const [hero, ridesRaw, gallery] = await Promise.all([
        PageHeroModel.findOne({ page: "rides" }).lean<IPageHero | null>(),
        ridesQuery.lean<IRideDocument[]>(),
        GalleryModel.find({ page: "rides" }).lean<IGalleryDocument[]>(),
      ]);

      const userId = req.user?._id;
      const username = req.user?.username;

      // Map rides to include isJoined logic
      const mappedRides = ridesRaw.map(ride => {
        let isJoined = false;
        const riders = ride.riders || [];
        
        if (userId) {
          isJoined = riders.some(
            (r: any) => 
              r.username === username || 
              r._id?.toString() === userId || 
              r.toString() === userId
          );
        }

        return {
          ...ride,
          isJoined,
          // Strip out riders array if not admin/crew to save bandwidth and maintain privacy
          riders: isAdminOrCrew ? ride.riders : undefined,
        };
      }) as unknown as IRideDocument[];

      const body: RidesPageDataResponse = {
        success: true,
        data: { hero, rides: mappedRides, gallery },
      };
      res.status(200).json(body);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/rides
   * Admin/Crew-only: creates a new ride document with image upload.
   *
   * Accepts multipart/form-data with:
   *   - image file (required)
   *   - ride text fields in req.body
   *
   * Storage lifecycle:
   *   1. Validate req.file presence.
   *   2. Upload binary to Supabase with UUID-keyed path.
   *   3. Persist the new Ride document with the resolved CDN URL.
   */
  async createRide(
    req: Request,
    res: Response<RideMutationResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "Validation Error: No image file detected in multi-part form-data payload.",
        });
        return;
      }

      const body = req.body as RideBodyPayload;

      if (
        !body.title ||
        !body.locationFrom ||
        !body.locationTo ||
        !body.date ||
        !body.distance ||
        !body.routeType ||
        !body.meetupTime ||
        !body.meetupLocation ||
        !body.description ||
        !body.duration
      ) {
        res.status(400).json({
          success: false,
          message: "Validation Error: All required ride fields must be provided.",
        });
        return;
      }

      const { supabaseStorageService } = await import("../services/supabaseStorage.service");

      const ext = (req.file.originalname.split(".").pop() ?? "jpg").toLowerCase();
      const uniqueName = `rides/${crypto.randomUUID()}.${ext}`;

      const imageUrl = await supabaseStorageService.uploadFileToBucket(
        BUCKET,
        uniqueName,
        req.file.buffer,
        req.file.mimetype
      );

      const newRide = new RideModel({
        title: body.title,
        location: {
          from: body.locationFrom,
          to: body.locationTo,
        },
        date: body.date,
        distance: body.distance,
        routeType: body.routeType,
        image: imageUrl,
        meetupTime: body.meetupTime,
        meetupLocation: body.meetupLocation,
        membersJoined: body.membersJoined ? parseInt(body.membersJoined, 10) : 0,
        description: body.description,
        duration: body.duration,
        past: body.past === "true",
      });

      await newRide.save();

      res.status(201).json({
        success: true,
        message: "Ride created successfully.",
        data: newRide.toObject(),
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/rides/:id
   * Admin/Crew-only: updates an existing ride document.
   *
   * Storage sanitation lifecycle (when a new image file is provided):
   *   1. Fetch existing ride document from MongoDB.
   *   2. Parse the old CDN URL → extract the Supabase storage path.
   *   3. Delete the orphaned asset from the bucket.
   *   4. Upload the new binary with a UUID-keyed path.
   *   5. Persist all updated fields and the fresh CDN URL.
   */
  async updateRide(
    req: Request,
    res: Response<RideMutationResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const ride = await RideModel.findById(id);

      if (!ride) {
        res.status(404).json({ success: false, message: "Ride document not found." });
        return;
      }

      const body = req.body as RideBodyPayload;

      if (req.file) {
        const { supabaseStorageService } = await import("../services/supabaseStorage.service");

        // ── Purge old cloud asset ─────────────────────────────────────────────
        if (ride.image) {
          try {
            const urlParts = ride.image.split("/public/images/");
            if (urlParts.length === 2) {
              const oldFileName = urlParts[1];
              console.log("[Rides Purge Loop] Destroying old ride asset:", oldFileName);
              await supabaseStorageService.deleteFileFromBucket(BUCKET, oldFileName);
              console.log("[Rides Purge Loop] Old asset successfully destroyed.");
            }
          } catch (e) {
            console.error("[Rides Purge Loop Fault] Failed to drop old ride image:", e);
          }
        }

        // ── Upload fresh asset ────────────────────────────────────────────────
        const ext = (req.file.originalname.split(".").pop() ?? "jpg").toLowerCase();
        const uniqueName = `rides/${crypto.randomUUID()}.${ext}`;

        ride.image = await supabaseStorageService.uploadFileToBucket(
          BUCKET,
          uniqueName,
          req.file.buffer,
          req.file.mimetype
        );
        console.log("[Rides Upload] New CDN URL committed:", ride.image);
      }

      // ── Apply text field mutations ────────────────────────────────────────
      if (body.title !== undefined) ride.title = body.title;
      if (body.locationFrom !== undefined) ride.location.from = body.locationFrom;
      if (body.locationTo !== undefined) ride.location.to = body.locationTo;
      if (body.date !== undefined) ride.date = body.date;
      if (body.distance !== undefined) ride.distance = body.distance;
      if (body.routeType !== undefined) ride.routeType = body.routeType;
      if (body.meetupTime !== undefined) ride.meetupTime = body.meetupTime;
      if (body.meetupLocation !== undefined) ride.meetupLocation = body.meetupLocation;
      if (body.membersJoined !== undefined) ride.membersJoined = parseInt(body.membersJoined, 10);
      if (body.description !== undefined) ride.description = body.description;
      if (body.duration !== undefined) ride.duration = body.duration;
      if (body.past !== undefined) ride.past = body.past === "true";

      await ride.save();
      await ride.populate("riders", "username -_id");

      res.status(200).json({
        success: true,
        message: "Ride updated successfully.",
        data: ride.toObject(),
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /api/rides/:id
   * Admin/Crew-only: deletes a ride document and purges its cloud image asset.
   *
   * Storage sanitation lifecycle:
   *   1. Fetch the ride document by ID.
   *   2. Parse the CDN URL → extract the Supabase filename.
   *   3. Delete the cloud asset to prevent bucket inflation.
   *   4. Remove the MongoDB document.
   */
  async deleteRide(
    req: Request,
    res: Response<RideMutationResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const ride = await RideModel.findById(id);

      if (!ride) {
        res.status(404).json({ success: false, message: "Ride document not found." });
        return;
      }

      // ── Purge cloud asset ─────────────────────────────────────────────────
      if (ride.image) {
        try {
          const { supabaseStorageService } = await import("../services/supabaseStorage.service");
          const urlParts = ride.image.split("/public/images/");
          if (urlParts.length === 2) {
            const filename = urlParts[1];
            console.log("[Rides Purge Loop] Destroying ride image asset:", filename);
            await supabaseStorageService.deleteFileFromBucket(BUCKET, filename);
            console.log("[Rides Purge Loop] Cloud image successfully destroyed.");
          }
        } catch (e) {
          console.error("[Rides Purge Loop Fault] Failed to delete cloud image:", e);
        }
      }

      await ride.deleteOne();

      res.status(200).json({
        success: true,
        message: "Ride deleted successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/rides/:id/join
   * Protected: Authenticated users can join an upcoming ride.
   */
  async joinRide(
    req: AuthenticatedRequest,
    res: Response<RideMutationResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?._id;

      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized." });
        return;
      }

      const ride = await RideModel.findById(id);

      if (!ride) {
        res.status(404).json({ success: false, message: "Ride not found." });
        return;
      }

      if (ride.past) {
        res.status(400).json({ success: false, message: "Cannot join a past ride." });
        return;
      }

      const alreadyJoined = ride.riders.some((r) => r.toString() === userId);
      if (alreadyJoined) {
        res.status(400).json({ success: false, message: "You have already joined this ride." });
        return;
      }

      const updatedRideRaw = await RideModel.findByIdAndUpdate(id, {
        $addToSet: { riders: userId },
        $inc: { membersJoined: 1 },
      }, { new: true });

      let finalRide: any = updatedRideRaw?.toObject();
      let isJoined = false;
      const finalRiders = finalRide.riders || [];
      const username = req.user?.username;
      
      if (req.user?.role === "admin" || req.user?.role === "crew") {
        await updatedRideRaw?.populate("riders", "username -_id");
        finalRide = updatedRideRaw?.toObject();
        isJoined = finalRide.riders.some((r: any) => r.username === username);
      } else {
        isJoined = finalRiders.some((r: any) => r.toString() === userId);
        delete finalRide.riders;
      }
      finalRide.isJoined = isJoined;

      res.status(200).json({ success: true, message: "Successfully joined the ride.", data: finalRide });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/rides/:id/withdraw
   * Protected: Authenticated users can withdraw from an upcoming ride.
   */
  async withdrawFromRide(
    req: AuthenticatedRequest,
    res: Response<RideMutationResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?._id;

      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized." });
        return;
      }

      const ride = await RideModel.findById(id);

      if (!ride) {
        res.status(404).json({ success: false, message: "Ride not found." });
        return;
      }

      const alreadyJoined = ride.riders.some((r) => r.toString() === userId);
      if (!alreadyJoined) {
        res.status(400).json({ success: false, message: "You are not a participant of this ride." });
        return;
      }

      const updatedRideRaw = await RideModel.findByIdAndUpdate(id, {
        $pull: { riders: userId },
        $inc: { membersJoined: -1 },
      }, { new: true });

      let finalRide: any = updatedRideRaw?.toObject();
      let isJoined = false;
      const finalRiders = finalRide.riders || [];
      const username = req.user?.username;
      
      if (req.user?.role === "admin" || req.user?.role === "crew") {
        await updatedRideRaw?.populate("riders", "username -_id");
        finalRide = updatedRideRaw?.toObject();
        isJoined = finalRide.riders.some((r: any) => r.username === username);
      } else {
        isJoined = finalRiders.some((r: any) => r.toString() === userId);
        delete finalRide.riders;
      }
      finalRide.isJoined = isJoined;

      res.status(200).json({ success: true, message: "Successfully withdrawn from the ride.", data: finalRide });
    } catch (err) {
      next(err);
    }
  }
}

/** Singleton instance — import this in route definitions. */
export const ridesController = new RidesController();
