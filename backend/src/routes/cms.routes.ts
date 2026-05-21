import { Router } from "express";
import { cmsController } from "../controllers/cms.controller";

/**
 * CMS resource routes.
 * Mounted at: /api
 *
 * Serves static/dynamic text and core presentation assets.
 */
const cmsRouter = Router();

// GET /api/cms/socials — fetch all social links
cmsRouter.get("/socials", cmsController.getSocials.bind(cmsController));

// GET /api/cms/home — aggregated home page payload
cmsRouter.get("/home", cmsController.getHomeData.bind(cmsController));

// GET /api/cms/about — aggregated about page payload
cmsRouter.get("/about", cmsController.getAboutData.bind(cmsController));

export { cmsRouter };
