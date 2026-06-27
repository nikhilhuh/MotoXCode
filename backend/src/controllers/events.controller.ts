import { Request, Response, NextFunction } from "express";
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

// Controller
/**
 * EventsController — serves event listings and associated gallery media.
 */
export class EventsController {
  /**
   * GET /api/rides/events
   * Concurrently fetches the events page hero, all events, and events gallery.
   */
  async getEventsPageData(
    _req: Request,
    res: Response<EventsPageDataResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const [hero, events, gallery] = await Promise.all([
        PageHeroModel.findOne({ page: "events" }).lean<IPageHero | null>(),
        EventModel.find().lean<IEventDocument[]>(),
        GalleryModel.find({ page: "events" }).lean<IGalleryDocument[]>(),
      ]);

      const body: EventsPageDataResponse = {
        success: true,
        data: { hero, events, gallery },
      };
      res.status(200).json(body);
    } catch (err) {
      next(err);
    }
  }
}

/** Singleton instance — import this in route definitions. */
export const eventsController = new EventsController();
