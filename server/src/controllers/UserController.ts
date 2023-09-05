import { NextFunction, Request, Response } from 'express';
import { IUser, UserModel } from "./../models/UserModel.js";
import UserService from './../services/UserService.js';
import TokenService from './../services/TokenService.js';
import ApiError from "../utils/ApiError.js";


class UserController {
  // Get All Users
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const allUsers = await UserService.getAll();
      res.json(allUsers);
      if(!allUsers) {
        throw ApiError.NotFoundError('Cannot get users');
    }
    } catch (error) {
      next(error);
    }
  }

  // Get One User by ID
  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      // Get User ID from request parameters and parse it into INTEGER
      const userId = parseInt(req.params.id);

      // Get the user by ID from UserService
      const foundUser = await UserService.getOne(userId);

      // If the user is not found then return an error message
      if (!foundUser) {
        throw ApiError.NotFoundError('User not found');
      }
      // Else return the found user
      res.json(foundUser)
    } catch (error) {
      next(error);
    }
  }

  //REGISTER
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const createdUser = await UserService.register(req.body.name, req.body.email, req.body.roles, req.body.password);

      if (!createdUser) {
        throw ApiError.InternalServerError('Failed to create user');
      }

      const { accessToken } = TokenService.generateAccessToken(createdUser);
      res.status(201).json({ accessToken: accessToken, user: createdUser});
    } catch (error) {
      next(error);
    }
  }

  //DELETE USER
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.id);

      const deletedUser = await UserModel.findByIdAndRemove(userId);

      if (!deletedUser) {
        throw ApiError.NotFoundError('User not found');
      }
      res.json(deletedUser);
    } catch (error) {
      next(error);
    }
  }

  //UPDATE
  async update(req: Request, res: Response, next: NextFunction) {
    try{
      // Get user id from URI parameters
      const userId = parseInt(req.params.id);
      const { name, email } = req.body;

      // Create a new user object with same id and updated fields
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { name, email },
        { new:true}
      );

      // If user is not found then return an error message
      if (!updatedUser) {
        throw ApiError.NotFoundError('User not found');
      }
      // Return the updated user
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();