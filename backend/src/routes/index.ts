import { Router } from "express";
import { demoRouter } from "./demoRoute";

/**
 * Central API router barrel.
 *
 * All sub-routers are mounted here and this router is attached to '/api' in app.ts.
 * Add new resource routers below as the API grows.
 *
 * Pattern: import { xyzRouter } from './xyzRoute';
 *           apiRouter.use('/xyz', xyzRouter);
 */
const apiRouter = Router();

// ─── Resource Routes ──────────────────────────────────────────────────────────

apiRouter.use("/test", demoRouter);

// apiRouter.use('/riders',  riderRouter);   // → /api/riders
// apiRouter.use('/users',   userRouter);    // → /api/users
// apiRouter.use('/bookings', bookingRouter); // → /api/bookings

export { apiRouter };
