import { Router } from "express";
import { demoController } from "../controllers/demo.controller";

/**
 * Demo resource routes.
 * Mounted at: /api/test
 *
 * All routes delegate directly to DemoController methods.
 * Input validation middleware (validate()) can be added per-route as needed.
 */
const demoRouter = Router();

// GET /api/test — fetch all demo records
demoRouter.get("/", demoController.getAll.bind(demoController));

export { demoRouter };
