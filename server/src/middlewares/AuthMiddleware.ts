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
  //checks if user in logged in

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
  try {
    authMiddleware(req, res, () => {
      const user = req.user;
      console.log(user);
      if (user.roles.includes("64f8e7589f2a3c538298b6f4")) {
        next(); // user is ADMIN, user can make CRUD operations
      } else {
        next(ApiError.ForbiddenError("Access denied. User is not an admin."));
      }
    });
  } catch (error) {
    next(ApiError.UnauthorizedError("Invalid Bearer token"));
  }
}

export { authMiddleware, isAdmin  };