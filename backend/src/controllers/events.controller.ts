import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import {
  PageHeroModel,
  IPageHero,
  EventModel,
  IEventDocument,
  GalleryModel,
  IGalleryDocument,
} from "../models";

// Response Shapes
interface EventsPageDataResponse {
  success: true;
  data: {
    hero: IPageHero | null;
    events: IEventDocument[];
    gallery: IGalleryDocument[];
  };
}

interface EventMutationResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

// Controller
const BUCKET = "images" as const;

/**
 * EventsController — serves event listings and associated gallery media.
 */
export class EventsController {
  /**
   * GET /api/rides/events
   * Concurrently fetches the events page hero, all events, and events gallery.
   */
  async getEventsPageData(
    req: AuthenticatedRequest,
    res: Response<EventsPageDataResponse>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const isAdminOrCrew =
        req.user?.role === "admin" || req.user?.role === "crew";

      let eventsQuery = EventModel.find().select("-__v");
      if (isAdminOrCrew) {
        eventsQuery = eventsQuery.populate("attendees", "username -_id");
      }

      const [hero, eventsRaw, gallery] = await Promise.all([
        PageHeroModel.findOne({ page: "events" }).lean<IPageHero | null>(),
        eventsQuery.lean<IEventDocument[]>(),
        GalleryModel.find({ page: "events" }).lean<IGalleryDocument[]>(),
      ]);

      const userId = req.user?._id;
      const username = req.user?.username;

      // Map events to include isJoined logic
      const mappedEvents = eventsRaw.map((event) => {
        let isJoined = false;
        const attendees = event.attendees || [];

        if (userId) {
          isJoined = attendees.some(
            (r: any) =>
              r.username === username ||
              r._id?.toString() === userId ||
              r.toString() === userId,
          );
        }

        return {
          ...event,
          isJoined,
          attendees: isAdminOrCrew ? event.attendees : undefined,
        };
      }) as unknown as IEventDocument[];

      const body: EventsPageDataResponse = {
        success: true,
        data: { hero, events: mappedEvents, gallery },
      };
      res.status(200).json(body);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/events/:id/join
   * Protected: Authenticated users can join an event.
   */
  async joinEvent(
    req: AuthenticatedRequest,
    res: Response<EventMutationResponse>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?._id;

      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized." });
        return;
      }

      const event = await EventModel.findById(id);

      if (!event) {
        res.status(404).json({ success: false, message: "Event not found." });
        return;
      }

      if (event.past) {
        res
          .status(400)
          .json({ success: false, message: "Cannot join a past event." });
        return;
      }

      const alreadyJoined = event.attendees.some(
        (r) => r.toString() === userId,
      );
      if (alreadyJoined) {
        res.status(400).json({
          success: false,
          message: "You have already joined this event.",
        });
        return;
      }

      if (event.spotsLeft <= 0) {
        res
          .status(400)
          .json({ success: false, message: "No spots left for this event." });
        return;
      }

      const updatedEventRaw = await EventModel.findByIdAndUpdate(
        id,
        {
          $addToSet: { attendees: userId },
          $inc: { spotsLeft: -1 },
        },
        { new: true },
      );

      let finalEvent: any = updatedEventRaw?.toObject();
      let isJoined = false;
      const finalAttendees = finalEvent.attendees || [];
      const username = req.user?.username;

      if (req.user?.role === "admin" || req.user?.role === "crew") {
        await updatedEventRaw?.populate("attendees", "username -_id");
        finalEvent = updatedEventRaw?.toObject();
        isJoined = finalEvent.attendees.some(
          (r: any) => r.username === username,
        );
      } else {
        isJoined = finalAttendees.some((r: any) => r.toString() === userId);
        delete finalEvent.attendees;
      }
      finalEvent.isJoined = isJoined;
      delete finalEvent.__v;
      delete finalEvent.id;

      res.status(200).json({
        success: true,
        message: "Successfully joined the event.",
        data: finalEvent,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/events/:id/withdraw
   * Protected: Authenticated users can withdraw from an event.
   */
  async withdrawFromEvent(
    req: AuthenticatedRequest,
    res: Response<EventMutationResponse>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?._id;

      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized." });
        return;
      }

      const event = await EventModel.findById(id);

      if (!event) {
        res.status(404).json({ success: false, message: "Event not found." });
        return;
      }

      const alreadyJoined = event.attendees.some(
        (r) => r.toString() === userId,
      );
      if (!alreadyJoined) {
        res.status(400).json({
          success: false,
          message: "You are not an attendee of this event.",
        });
        return;
      }

      const updatedEventRaw = await EventModel.findByIdAndUpdate(
        id,
        {
          $pull: { attendees: userId },
          $inc: { spotsLeft: 1 },
        },
        { new: true },
      );

      let finalEvent: any = updatedEventRaw?.toObject();
      let isJoined = false;
      const finalAttendees = finalEvent.attendees || [];
      const username = req.user?.username;

      if (req.user?.role === "admin" || req.user?.role === "crew") {
        await updatedEventRaw?.populate("attendees", "username -_id");
        finalEvent = updatedEventRaw?.toObject();
        isJoined = finalEvent.attendees.some(
          (r: any) => r.username === username,
        );
      } else {
        isJoined = finalAttendees.some((r: any) => r.toString() === userId);
        delete finalEvent.attendees;
      }
      finalEvent.isJoined = isJoined;
      delete finalEvent.__v;
      delete finalEvent.id;

      res.status(200).json({
        success: true,
        message: "Successfully withdrawn from the event.",
        data: finalEvent,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/events
   * Admin/Crew-only: creates a new event document.
   */
  async createEvent(
    req: Request,
    res: Response<EventMutationResponse>,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message:
            "Validation Error: No image file detected in multi-part form-data payload.",
        });
        return;
      }

      const body = req.body;

      if (
        !body.title ||
        !body.location ||
        !body.date ||
        !body.type ||
        !body.time ||
        !body.spots ||
        !body.description
      ) {
        res.status(400).json({
          success: false,
          message:
            "Validation Error: All required event fields must be provided.",
        });
        return;
      }

      const { supabaseStorageService } =
        await import("../services/supabaseStorage.service");

      const ext = (
        req.file.originalname.split(".").pop() ?? "jpg"
      ).toLowerCase();
      const uniqueName = `events/${crypto.randomUUID()}.${ext}`;

      const imageUrl = await supabaseStorageService.uploadFileToBucket(
        BUCKET,
        uniqueName,
        req.file.buffer,
        req.file.mimetype,
      );

      const spots = parseInt(body.spots, 10);

      const newEvent = new EventModel({
        title: body.title,
        location: body.location,
        date: body.date,
        type: body.type,
        time: body.time,
        spots: spots,
        spotsLeft: spots,
        description: body.description,
        image: imageUrl,
        past: body.past === true || body.past === "true",
      });

      await newEvent.save();
      const eventData: any = newEvent.toObject();
      delete eventData.__v;
      delete eventData.id;

      res.status(201).json({
        success: true,
        message: "Event created successfully.",
        data: eventData,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/events/:id
   * Admin/Crew-only: updates an existing event document.
   */
  async updateEvent(
    req: Request,
    res: Response<EventMutationResponse>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const event = await EventModel.findById(id);

      if (!event) {
        res
          .status(404)
          .json({ success: false, message: "Event document not found." });
        return;
      }

      const body = req.body;

      if (req.file) {
        const { supabaseStorageService } =
          await import("../services/supabaseStorage.service");

        // ── Purge old cloud asset ─────────────────────────────────────────────
        if (event.image) {
          try {
            const urlParts = event.image.split("/public/images/");
            if (urlParts.length === 2) {
              const oldFileName = urlParts[1];
              console.log(
                "[Events Purge Loop] Destroying old event asset:",
                oldFileName,
              );
              await supabaseStorageService.deleteFileFromBucket(
                BUCKET,
                oldFileName,
              );
              console.log(
                "[Events Purge Loop] Old asset successfully destroyed.",
              );
            }
          } catch (e) {
            console.error(
              "[Events Purge Loop Fault] Failed to drop old event image:",
              e,
            );
          }
        }

        // ── Upload fresh asset ────────────────────────────────────────────────
        const ext = (
          req.file.originalname.split(".").pop() ?? "jpg"
        ).toLowerCase();
        const uniqueName = `events/${crypto.randomUUID()}.${ext}`;

        event.image = await supabaseStorageService.uploadFileToBucket(
          BUCKET,
          uniqueName,
          req.file.buffer,
          req.file.mimetype,
        );
        console.log("[Events Upload] New CDN URL committed:", event.image);
      }

      if (body.title !== undefined) event.title = body.title;
      if (body.location !== undefined) event.location = body.location;
      if (body.date !== undefined) event.date = body.date;
      if (body.type !== undefined) event.type = body.type;
      if (body.time !== undefined) event.time = body.time;
      if (body.description !== undefined) event.description = body.description;
      if (body.past !== undefined)
        event.past = body.past === true || body.past === "true";

      if (body.spots !== undefined) {
        const newSpots = parseInt(body.spots, 10);
        const diff = newSpots - event.spots;
        event.spots = newSpots;
        event.spotsLeft = Math.max(0, event.spotsLeft + diff); // Adjust spotsLeft, prevent negative
      }

      await event.save();
      await event.populate("attendees", "username -_id");
      const eventData: any = event.toObject();
      delete eventData.__v;
      delete eventData.id;

      res.status(200).json({
        success: true,
        message: "Event updated successfully.",
        data: eventData,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /api/events/:id
   * Admin/Crew-only: deletes an event document.
   */
  async deleteEvent(
    req: Request,
    res: Response<EventMutationResponse>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const event = await EventModel.findById(id);

      if (!event) {
        res
          .status(404)
          .json({ success: false, message: "Event document not found." });
        return;
      }

      // ── Purge cloud asset ─────────────────────────────────────────────────
      if (event.image) {
        try {
          const { supabaseStorageService } =
            await import("../services/supabaseStorage.service");
          const urlParts = event.image.split("/public/images/");
          if (urlParts.length === 2) {
            const filename = urlParts[1];
            console.log(
              "[Events Purge Loop] Destroying event image asset:",
              filename,
            );
            await supabaseStorageService.deleteFileFromBucket(BUCKET, filename);
            console.log(
              "[Events Purge Loop] Cloud image successfully destroyed.",
            );
          }
        } catch (e) {
          console.error(
            "[Events Purge Loop Fault] Failed to delete cloud image:",
            e,
          );
        }
      }

      await event.deleteOne();

      res.status(200).json({
        success: true,
        message: "Event deleted successfully.",
      });
    } catch (err) {
      next(err);
    }
  }
}

/** Singleton instance — import this in route definitions. */
export const eventsController = new EventsController();
