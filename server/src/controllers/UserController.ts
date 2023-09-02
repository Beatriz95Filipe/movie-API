import { Request, Response } from 'express';
import { IUser, UserModel } from "./../models/UserModel.js";
import UserService from './../services/UserService.js';
import TokenService from './../services/TokenService.js';


class UserController {
  // Get All Users
  async getAll(req: Request, res: Response) {
    try {
      const allUsers = await UserService.getAll();
      res.json(allUsers);
    } catch (err) {
      console.log(err);
      res.status(500).send({ errorMessage: 'Cannot get users', error: err })
    }
  }

  // Get One User by ID
  async getOne(req: Request, res: Response) {
    try {
      // Get User ID from request parameters and parse it into INTEGER
      const userId = parseInt(req.params.id);

      // Get the user by ID from UserService
      const foundUser = await UserService.getOne(userId);

      // If the user is not found then return an error message
      if (!foundUser) {
        res.status(404).send({ errorMessage: 'User not found' });
      }
      // Else return the found user
      res.json(foundUser)
    } catch (err) {
      console.log(err);
      res.status(500).send({ errorMessage: 'Something happened', error: err })
    }
  }

  //REGISTER
  async register(req: Request, res: Response) {
    try {
      const createdUser = await UserService.register(req.body.name, req.body.email, req.body.roles, req.body.password);

      if (!createdUser) {
        return res.status(500).send({ errorMessage: 'Failed to create user' })
      }

      const { accessToken } = TokenService.generateAccessToken(createdUser);
      res.status(201).json({ accessToken: accessToken, user: createdUser});
    } catch (err) {
      console.log(err);
      res.status(500).send({ errorMessage: 'Failed to create user', error: err })
    }
  }

  //DELETE USER
  async delete(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);

      const deletedUser = await UserModel.findByIdAndRemove(userId);

      if (!deletedUser) {
        res.status(404).json({ error: "User not found" });
      }
      res.json(deletedUser);
    } catch (err) {
      console.log(err);
      res.status(500).send({ errorMessage: 'Failed to delete user', error: err });
    }
  }

  //UPDATE
  async update(req: Request, res: Response) {
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
        res.status(404).json({ error: "User not found" });
        }
        // Return the updated user
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).send({ errorMessage: 'Failed to update user', error: err });
    }
}
}

export default new UserController();