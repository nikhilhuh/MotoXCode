import { Request, Response, NextFunction } from "express";
import {
  PageHeroModel,
  IPageHero,
  MemberModel,
  IMemberDocument,
} from "../models";

// ─── Response Shapes ──────────────────────────────────────────────────────────

interface CrewDataResponse {
  success: true;
  data: {
    hero: IPageHero | null;
    members: IMemberDocument[];
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
      const [hero, members] = await Promise.all([
        PageHeroModel.findOne({ page: "crew" }).lean<IPageHero | null>(),
        MemberModel.find().lean<IMemberDocument[]>(),
      ]);

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
