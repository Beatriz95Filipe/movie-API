import { IUser, UserModel } from "./../models/UserModel.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from 'bcryptjs';
import TokenService from "./TokenService.js";

class AuthService {
  async isAdmin(user: IUser) {
    return user.roles.includes("64f8e7589f2a3c538298b6f4");
  }

  async getAll() {
    try {
      const allUsers: IUser[] = await UserModel.find()
        .populate('roles')
        .select('-password');

      console.log(allUsers)

      return allUsers;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getOne(userId: string) {
    try {
      const user: IUser = await UserModel.findById(userId)
        .populate('roles')
        .select('-password');
      return user;
    } catch (error) {
      throw error;
    }
  }

  async register(name: string, email: string, password: string, roleIds: string[] = []): Promise<IUser> {
    try {
      const existingUser = await UserModel.findOne({ email });

      if (existingUser) {
        throw ApiError.ConflictError(`User ${name} already exists`);
      }

      // Assign roles based on provided roleIds or use the default role ID = USER
      const rolesToAssign = roleIds.length > 0 ? roleIds : ['64f8e79e0b80b75a3b5c78f4'];
      console.error(rolesToAssign);

      const newUser: IUser = new UserModel({
        name,
        email,
        password,
        roles: rolesToAssign,
      });

      const savedUser = await newUser.save();

      return savedUser;

    } catch (error) {
      console.error(error);
      throw ApiError.InternalServerError("Registration failed.");
    }
  }


  async login(email: string, password: string) {
    const user = await UserModel.find({email});

    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        throw ApiError.UnauthorizedError("Authentication failed");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw ApiError.UnauthorizedError("Authentication failed");
      }

      const { accessToken } = TokenService.generateAccessToken(user);

      return { accessToken, user };
    } catch (error) {
      console.error(error);
      throw ApiError.InternalServerError("Authentication failed.");
    }
  }
}

export default new AuthService();