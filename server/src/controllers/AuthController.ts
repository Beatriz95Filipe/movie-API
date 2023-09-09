import { NextFunction, Request, Response } from "express";
import AuthService from "../services/AuthService.js";
import { IUser, UserModel } from "./../models/UserModel.js";
import { IRole, RoleModel } from "./../models/RoleModel.js";
import TokenService from "../services/TokenService.js";
import bcrypt from 'bcryptjs';
import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

class AuthController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userRoles = req.user.roles;

      if (!userRoles.includes("64f8e7589f2a3c538298b6f4")) {
        throw ApiError.ForbiddenError("Access denied. User is not an admin.");
      }

      const allUsers = await AuthService.getAll();

      res.json(allUsers);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      console.error(errors);

      if (!errors.isEmpty()) {
        throw ApiError.InternalServerError("Error during registration.");
        // return res
          // .status(500)
          // .json({ message: "Error during registration.", errors });
      }
      const { name, email, password, roleIds } = req.body;
      const newUser = await AuthService.register(name, email, password, roleIds);
      const { accessToken } = TokenService.generateAccessToken(newUser);

      console.error(newUser, accessToken);
      res.status(201).json({ accessToken: accessToken, user: newUser });
    } catch (error) {
      console.error(error);
      next(error);
      // res.status(500).json({ errorMessage: 'Registration failed', error: error });
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    try {
      const errors = validationResult(req);
      console.error(errors);
      if (!errors.isEmpty()) {
        throw ApiError.InternalServerError("Error during login.");
      }

      const { accessToken, user } = await AuthService.login(email, password);
      res.json({ accessToken, user });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { roleName } = req.body;
      const createdRole: IRole = await RoleModel.create({ name: roleName });

      if (!createdRole) {
        throw ApiError.InternalServerError("Unable to create Role.");
      }

      return res.status(201).json(createdRole);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async deleteRole(req: Request, res: Response, next: NextFunction) {
    try {
      const roleID = req.params.id;

      const deletedRole: IRole | null =
        await RoleModel.findByIdAndDelete(roleID);

      if (!deletedRole) {
        throw ApiError.NotFoundError("Role not found");
      }

      res.json(deletedRole);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();