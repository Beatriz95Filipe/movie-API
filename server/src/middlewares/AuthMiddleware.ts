import { Response, Request, NextFunction } from "express";
import TokenService from "../services/TokenService.js";
import ApiError from "../utils/ApiError.js";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string,
        email: string,
        roles: string[];
      };
    }
  }
}

function authMiddleware(req: Request, res: Response, next: NextFunction) {

  const authToken = req.headers.authorization;

  if (!authToken) {
    throw ApiError.UnauthorizedError("Unauthorized");
  }
  const token = authToken.split(' ')[1]; // Extract the token from Bearer

  const decodedPayload = TokenService.validateAccessToken(token);

  if (!decodedPayload) {
    throw ApiError.UnauthorizedError("Invalid Bearer token");
  }

  req.user = decodedPayload;

  next();
}

function isAdmin(req: Request, res: Response, next: NextFunction) {
  const user = req.user;
  if (user.roles.includes("64f8e7589f2a3c538298b6f4")) {
    next(); // user is ADMIN, user can delete
  } else {
    next(ApiError.ForbiddenError("Access denied. User is not an admin."));
  }
}

export { authMiddleware, isAdmin  };