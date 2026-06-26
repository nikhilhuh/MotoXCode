import { Request, Response, NextFunction } from "express";
import { AppError } from "./error.middleware";
import { verifyToken } from "../services/auth.service";
import { Member } from "../models";

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
  next: NextFunction,
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
      throw new AppError(
        "You are not logged in. Please log in to get access.",
        401,
      );
    }

    const decoded = verifyToken(token);

    // Ensure the user still exists
    const currentUser = await Member.findById(decoded.sub).select(
      "_id username role",
    );
    if (!currentUser) {
      throw new AppError(
        "The user belonging to this token no longer exists.",
        401,
      );
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

/**
 * Optional Auth interceptor
 * Decodes the token if present to inject req.user, but does not throw if absent.
 */
export async function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
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
      return next();
    }

    const decoded = verifyToken(token);
    const currentUser = await Member.findById(decoded.sub).select(
      "_id username role",
    );
    
    if (currentUser) {
      req.user = {
        _id: String(currentUser._id),
        username: currentUser.username,
        role: currentUser.role,
      };
    }
    
    next();
  } catch (err) {
    // If token is invalid, we can just proceed as unauthenticated
    next();
  }
}

/**
 * Administrative gate interceptor — must be mounted after requireAuth.
 *
 * Validates that the authenticated session belongs to a user with the
 * "admin" role. Non-admin requests are immediately rejected with a 403
 * so no privileged mutation logic is ever reached.
 */
export async function verifyAdminGate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({
      success: false,
      message:
        "Access Denied: Administrative privileges required to perform this transaction.",
    });
    return;
  }
  next();
}

/**
 * Elevated operational privilege gate — must be mounted after requireAuth.
 *
 * Accepts both "admin" and "crew" roles. All other roles are immediately
 * rejected with 403 so no privileged ride mutation logic is ever reached.
 */
export async function verifyAdminOrCrewGate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!req.user || (req.user.role !== "admin" && req.user.role !== "crew")) {
    res.status(403).json({
      success: false,
      message: "Unauthorized. Elevated operational privileges required.",
    });
    return;
  }
  next();
}
