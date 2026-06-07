import { Request, Response, NextFunction } from "express";
import { AppError } from "./error.middleware";
import { verifyToken, JwtPayload } from "../services/auth.service";
import { Crew } from "../models/Crew";

export interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    username: string;
    role: string;
  };
}

/**
 * Route guard interceptor middleware to protect endpoints
 * and inject the authenticated session context into the request.
 */
export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AppError("You are not logged in. Please log in to get access.", 401);
    }

    const decoded = verifyToken(token);

    // Ensure the user still exists
    const currentUser = await Crew.findById(decoded.sub).select("_id username role");
    if (!currentUser) {
      throw new AppError("The user belonging to this token no longer exists.", 401);
    }

    req.user = {
      _id: String(currentUser._id),
      username: currentUser.username,
      role: currentUser.role,
    };

    next();
  } catch (err) {
    next(err);
  }
}
