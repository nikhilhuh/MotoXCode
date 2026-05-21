import { Router } from "express";
import { cmsRouter } from "./cms.routes";
import { rideRouter } from "./ride.routes";
import { eventRouter } from "./event.routes";
import { crewRouter } from "./crew.routes";
import { intakeRouter } from "./intake.routes";

/**
 * Central API router barrel.
 *
 * All sub-routers are mounted here and this router is attached to
 * '/api' in app.ts. Each sub-router owns a distinct resource domain.
 *
 * ─── Route Map ─────────────────────────────────────────────────────────────
 *
 *   /api/cms      → Static/dynamic text and core presentation assets
 *   /api/rides    → Community rides, tracking, events, and media streams
 *   /api/crew     → Member rosters and squad allocations
 *   /api/intake   → Secure form submission parsing listeners
 *
 * Legacy:
 *   /api/test     → Demo route (remove when replaced)
 */
const apiRouter = Router();

// ─── Resource Routes ──────────────────────────────────────────────────────────

apiRouter.use("/", cmsRouter);
apiRouter.use("/", rideRouter);
apiRouter.use("/", eventRouter);
apiRouter.use("/", crewRouter);
apiRouter.use("/", intakeRouter);

export { apiRouter };
