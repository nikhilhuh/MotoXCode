import { Request, Response, NextFunction } from "express";
import {
  PageHeroModel,
  IPageHero,
  RideModel,
  IRideDocument,
  GalleryModel,
  IGalleryDocument,
} from "../models";

// ─── Response Shapes ──────────────────────────────────────────────────────────

interface RidesPageDataResponse {
  success: true;
  data: {
    hero: IPageHero | null;
    rides: IRideDocument[];
    gallery: IGalleryDocument[];
  };
}

// ─── Controller ───────────────────────────────────────────────────────────────

/**
 * RidesController — serves community ride data, tracking info, and media.
 */
export class RidesController {
  /**
   * GET /api/rides
   * Concurrently fetches the rides page hero, all rides, and rides gallery.
   */
  async getRidesPageData(
    _req: Request,
    res: Response<RidesPageDataResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const [hero, rides, gallery] = await Promise.all([
        PageHeroModel.findOne({ page: "rides" }).lean<IPageHero | null>(),
        RideModel.find().lean<IRideDocument[]>(),
        GalleryModel.find({ page: "rides" }).lean<IGalleryDocument[]>(),
      ]);

      const body: RidesPageDataResponse = {
        success: true,
        data: { hero, rides, gallery },
      };
      res.status(200).json(body);
    } catch (err) {
      next(err);
    }
  }
}

/** Singleton instance — import this in route definitions. */
export const ridesController = new RidesController();
