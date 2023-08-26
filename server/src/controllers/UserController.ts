// import { Request, Response } from 'express';
// import { IUser } from './../models/userModel.js';
// import UserService from './../services/UserService.js';
// import TokenService from './../services/TokenService.js';


// class UserController {
//   // Get All Users
//   async getAll(req: Request, res: Response) {
//     try {
//       const allUsers = await UserService.getAll();
//       res.json(allUsers);
//     } catch (err) {
//       console.log(err);
//       res.status(500).send({ errorMessage: 'Cannot get users', error: err })
//     }
//   }

//   // Get One User by ID
//   getOne(req: Request, res: Response) {
//     try {
//       // Get User ID from request parameters and parse it into INTEGER
//       const userId = parseInt(req.params.id);

//       // Get the user by ID from UserService
//       const foundUser = UserService.getOne(userId)

//       // If the user is not found then return an error message
//       if (!foundUser) {
//         res.status(404).send({ errorMessage: 'User not found' })
//       }
//       // Else return the found user
//       res.json(foundUser)
//     } catch (err) {
//       console.log(err);
//       res.status(500).send({ errorMessage: 'Something happened', error: err })
//     }
//   }


//   async register(req: Request, res: Response) {
//     try {
//       const createdUser = await UserService.register(req.body.name, req.body.email, req.body.roles, req.body.password);

//       if (!createdUser) {
//         return res.status(500).send({ errorMessage: 'Failed to create user' })
//       }

//       const { accessToken } = TokenService.generateAccessToken(createdUser);
//       res.status(201).json({ accessToken: accessToken, user: createdUser});
//     } catch (err) {
//       console.log(err);
//       res.status(500).send({ errorMessage: 'Failed to create user', error: err })
//     }
//   }
//   // delete(req: Request, res: Response) {
//   //   try {
//   //     const userId = parseInt(req.params.id);

//   //     const deletedUserIndex = users.findIndex((user) => user.id === userId);

//   //     if (deletedUserIndex === -1) {
//   //       res.status(404).json({ error: "User not found" });
//   //     }
//   //     const deletedUser = users.splice(deletedUserIndex, 1)[0];
//   //     res.json(deletedUser);
//   //   } catch (err) {
//   //     console.log(err);
//   //     res.status(500).send({ errorMessage: 'Failed to delete user', error: err })
//   //   }
//   // }
//   // update(req: Request, res: Response) {

//   //   // Get user id from URI parameters
//   //   const userId = parseInt(req.params.id);

//   //   // Find user index by ID
//   //   const updatedUserIndex = users.findIndex((user) => user.id === userId);

//   //   // If user is not found then return an error message
//   //   if (updatedUserIndex === -1) {
//   //     res.status(404).json({ error: "User not found" });
//   //   }

//   //   // Create a new user object with same id and updated fields
//   //   const updatedUser: IUser = {
//   //     id: userId,
//   //     name: req.body.name,
//   //     email: req.body.email
//   //   }
//   //   // Replace old user by new user
//   //   users[updatedUserIndex] = updatedUser;

//   //   // Return the updated user
//   //   res.json(updatedUser);
//   // }
// }

// export default new UserController();