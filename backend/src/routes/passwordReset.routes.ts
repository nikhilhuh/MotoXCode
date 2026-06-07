import { Router } from "express";
import { forgotPassword, verifyResetToken, resetPassword } from "../controllers/passwordReset.controller";

const passwordResetRouter = Router();

passwordResetRouter.post("/forgot-password", forgotPassword);
passwordResetRouter.post("/verify-reset-token", verifyResetToken);
passwordResetRouter.post("/reset-password", resetPassword);

export { passwordResetRouter };
