import { IUser, UserModel } from "./../models/UserModel.js";
import { IRole }  from "./../models/RoleModel.js";
import bcrypt from 'bcryptjs';
import ApiError from "../utils/ApiError.js";

let users: IUser[] = [];

class UserService {
  // Get All Users
  async getAll(): Promise<IUser[]> {
    try{
        const allUsers = await UserModel.find();
        console.log(allUsers);
        return allUsers;
    } catch (err) {
        console.log(err);
        throw new Error("Cannot get users");
    }
  }

  // Get One User by ID
  async getOne(id: number): Promise<IUser | null> {
    try{
        const foundUser = await UserModel.findById(id);
        return foundUser;
    } catch (err) {
        console.log(err);
        throw new Error("Cannot get user");
    }
  }

  async register(
    name: string,
    email: string,
    roles: string[],
    password: string
    ): Promise<IUser | undefined> {
    try {
      if (!password) {
        throw ApiError.BadRequestError("Password is required.");
      }
      if (!roles.every(role => typeof role === "string")) {
        throw ApiError.BadRequestError("Invalid role value.");
      }

      //check if user already exists
      const existingUser = users.find(user => user.email === email);
      if(existingUser) {
        throw ApiError.ConflictError("An user with this email already exists.");
      }

      // generates a hashed password to store in the database
      const hashedPassword = await bcrypt.hash(password, 7);

      const createdUser = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        roles
      });
      return createdUser as IUser;
    } catch (error) {
      console.error(error);
      throw ApiError.InternalServerError("Failed to create user.");
    }
  }
}

export default new UserService();