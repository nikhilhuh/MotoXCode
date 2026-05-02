import express from "express";
import { router as demoRoute } from "../routes/demoRoute";

const mainRouter = express.Router();

// Middleware to log requests
mainRouter.use("/test", demoRoute)


export { mainRouter };