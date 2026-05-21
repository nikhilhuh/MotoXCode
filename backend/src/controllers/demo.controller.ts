import { Request, Response, NextFunction } from "express";
import { demoService } from "../services/demo.service";
import { IDemoDocument } from "../models";

// ─── Response Shapes ──────────────────────────────────────────────────────────

interface SuccessResponse<T> {
  success: true;
  count?: number;
  data: T;
}

// ─── Controller ───────────────────────────────────────────────────────────────

/**
 * DemoController — orchestrates HTTP requests for the Demo resource.
 *
 * Responsibilities:
 * - Read validated request data (req.body / req.params / req.query)
 * - Delegate business logic to DemoService
 * - Serialize the result into a typed HTTP response
 * - Forward any errors to the global error handler via next(err)
 */
export class DemoController {
  /**
   * GET /api/test
   * Returns all documents from the DemoCollection.
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: IDemoDocument[] = await demoService.fetchAll();
      const body: SuccessResponse<IDemoDocument[]> = {
        success: true,
        count: data.length,
        data,
      };
      res.status(200).json(body);
    } catch (err) {
      next(err);
    }
  }
}

/** Singleton instance — import this in route definitions. */
export const demoController = new DemoController();
