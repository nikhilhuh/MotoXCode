import { Request, Response, NextFunction } from "express";
import {
  SocialModel,
  ISocialDocument,
  PageHeroModel,
  IPageHero,
  StatModel,
  IStatDocument,
  ValueModel,
  IValueDocument,
  RideModel,
  IRideDocument,
  MemberModel,
  IMemberDocument,
  GalleryModel,
  IGalleryDocument,
  PhilosophyModel,
  IPhilosophyDocument,
  TimelineModel,
  ITimelineDocument,
  RidingCodeModel,
  IRidingCodeDocument,
} from "../models";

// ─── Response Shapes ──────────────────────────────────────────────────────────

interface SocialsResponse {
  success: true;
  data: ISocialDocument[];
}

interface HomeDataResponse {
  success: true;
  data: {
    hero: IPageHero | null;
    stats: IStatDocument[];
    values: IValueDocument[];
    upcomingRides: IRideDocument[];
    mvpMembers: IMemberDocument[];
    gallery: IGalleryDocument[];
  };
}

interface AboutDataResponse {
  success: true;
  data: {
    hero: IPageHero | null;
    philosophies: IPhilosophyDocument[];
    timeline: ITimelineDocument[];
    ridingCodes: IRidingCodeDocument[];
  };
}

// ─── Controller ───────────────────────────────────────────────────────────────

/**
 * CmsController — serves static/dynamic CMS text and core presentation assets.
 *
 * Aggregates data from multiple collections into page-ready payloads
 * using concurrent Mongoose queries via Promise.all().
 */
export class CmsController {
  /**
   * GET /api/cms/socials
   * Returns all documents from the Social collection.
   */
  async getSocials(
    _req: Request,
    res: Response<SocialsResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: ISocialDocument[] = await SocialModel.find().lean<ISocialDocument[]>();
      const body: SocialsResponse = {
        success: true,
        data,
      };
      res.status(200).json(body);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/cms/home
   * Concurrently fetches all data needed for the Home page.
   */
  async getHomeData(
    _req: Request,
    res: Response<HomeDataResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const [hero, stats, values, upcomingRides, mvpMembers, gallery] =
        await Promise.all([
          PageHeroModel.findOne({ page: "home" }).lean<IPageHero | null>(),
          StatModel.find().lean<IStatDocument[]>(),
          ValueModel.find().lean<IValueDocument[]>(),
          RideModel.find({ past: false })
            .sort({ date: 1 })
            .limit(3)
            .lean<IRideDocument[]>(),
          MemberModel.find({ mvp: true }).lean<IMemberDocument[]>(),
          GalleryModel.find({ page: "home" }).lean<IGalleryDocument[]>(),
        ]);

      const body: HomeDataResponse = {
        success: true,
        data: { hero, stats, values, upcomingRides, mvpMembers, gallery },
      };
      res.status(200).json(body);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/cms/about
   * Concurrently fetches all data needed for the About page.
   */
  async getAboutData(
    _req: Request,
    res: Response<AboutDataResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const [hero, philosophies, timeline, ridingCodes] = await Promise.all([
        PageHeroModel.findOne({ page: "about" }).lean<IPageHero | null>(),
        PhilosophyModel.find().lean<IPhilosophyDocument[]>(),
        TimelineModel.find().lean<ITimelineDocument[]>(),
        RidingCodeModel.find().lean<IRidingCodeDocument[]>(),
      ]);

      const body: AboutDataResponse = {
        success: true,
        data: { hero, philosophies, timeline, ridingCodes },
      };
      res.status(200).json(body);
    } catch (err) {
      next(err);
    }
  }
}

/** Singleton instance — import this in route definitions. */
export const cmsController = new CmsController();
