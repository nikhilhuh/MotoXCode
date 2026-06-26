import { Router } from "express";
import { intakeController } from "../controllers/intake.controller";

/**
 * Intake resource routes.
 * Mounted at: /api
 * Secure form submission parsing listeners for contact and membership flows.
 */
const intakeRouter = Router();

// GET /api/contact — contact page data payload
intakeRouter.get("/contact", intakeController.getContactPageData.bind(intakeController));

// POST /api/intake/contact — submit a contact form
intakeRouter.post("/contact", intakeController.handleContactSubmission.bind(intakeController));

// GET /api/join — join page data payload
intakeRouter.get("/join", intakeController.getJoinPageData.bind(intakeController));

// POST /api/intake/join — submit a membership application
intakeRouter.post("/join", intakeController.handleJoinSubmission.bind(intakeController));

export { intakeRouter };
