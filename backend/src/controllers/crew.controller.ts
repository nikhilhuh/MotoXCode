import { Request, Response, NextFunction } from "express";
import {
  PageHeroModel,
  IPageHero,
  Member,
} from "../models";

// ─── Response Shapes ──────────────────────────────────────────────────────────

interface CrewDataResponse {
  success: true;
  data: {
    hero: IPageHero | null;
    members: any[];
  };
}

// ─── Controller ───────────────────────────────────────────────────────────────

/**
 * CrewController — serves member rosters and squad allocations.
 */
export class CrewController {
  /**
   * GET /api/crew
   * Concurrently fetches the crew page hero and all members.
   */
  async getCrewData(
    _req: Request,
    res: Response<CrewDataResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const [hero, rawMembers] = await Promise.all([
        PageHeroModel.findOne({ page: "crew" }).lean<IPageHero | null>(),
        Member.find({}).select("username avatar name headline location years role").lean(),
      ]);

      const members = rawMembers.map(m => ({
        username: m.username,
        avatar: m.avatar,
        name: m.name,
        headline: m.headline,
        location: m.location,
        years: m.years,
        role: m.role,
      }));

      const body: CrewDataResponse = {
        success: true,
        data: { hero, members },
      };
      res.status(200).json(body);
    } catch (err) {
      next(err);
    }
  }
}

/** Singleton instance — import this in route definitions. */
export const crewController = new CrewController();
