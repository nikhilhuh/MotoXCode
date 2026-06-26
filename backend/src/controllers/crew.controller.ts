import { Request, Response, NextFunction } from "express";
import { PageHeroModel, IPageHero, Member } from "../models";

// Response Shapes
interface CrewDataResponse {
  success: true;
  data: {
    hero: IPageHero | null;
    mvpMembers: any[];
    normalMembers: any[];
  };
}

// Controller
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
    next: NextFunction,
  ): Promise<void> {
    try {
      const [hero, rawMembers] = await Promise.all([
        PageHeroModel.findOne({ page: "crew" }).lean<IPageHero | null>(),
        Member.find({})
          .select("-_id username avatar name headline location years role")
          .lean(),
      ]);

      const mvpMembers = rawMembers
        .filter((m) => m.role === "admin" || m.role === "crew")
        .map(({ role, ...member }) => member);

      const normalMembers = rawMembers
        .filter((m) => m.role !== "admin" && m.role !== "crew")
        .map(({ role, ...member }) => member);

      const body: CrewDataResponse = {
        success: true,
        data: { hero, mvpMembers, normalMembers },
      };
      res.status(200).json(body);
    } catch (err) {
      next(err);
    }
  }
}

/** Singleton instance — import this in route definitions. */
export const crewController = new CrewController();
