import { Router } from "express";
import { crewController } from "../controllers/crew.controller";

/**
 * Crew resource routes.
 * Mounted at: /api
 * Member rosters and squad allocations.
 */
const crewRouter = Router();

// GET /api/crew — aggregated crew page payload
crewRouter.get("/crew", crewController.getCrewData.bind(crewController));

export { crewRouter };