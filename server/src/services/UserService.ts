// import { IUser } from './../models/userModel.js';
// import Role from './../models/roleModel.js'
// import bcrypt from 'bcryptjs';

// let users: IUser[] = [];

// users = [{ id: 1, name: "Alex", email: "api@gmail.com", roles: [Role.USER] },
// { id: 2, name: "Fiama", email: "fiama@gmail.com", roles: [Role.USER] }]
// users.push({ id: 3, name: "Maria", email: "maria@gmail.com", roles: [Role.USER] })

// class UserService {
//   // Get All Users
//   async getAll(): Promise<IUser[]> {
//     const allUsers = users;
//     return await allUsers;
//   }

//   // Get One User by ID
//   async getOne(id: number): Promise<IUser | undefined> {
//     const foundUser = users.find((user) => user.id === id);
//     return await foundUser
//   }


//   async register(name: string, email: string, roles: Role[] = [Role.USER], password: string): Promise<IUser | undefined> {
//     try {
//       if (!password) {
//         throw new Error('Password is required.');
//       }
//       if (!roles.every(role => [Role.ADMIN, Role.USER].includes(role))) {
//         throw new Error('Invalid role value.');
//       }
//       // generates a hashed password to store in the database
//       const hashedPassword = await bcrypt.hash(password, 7);

//       const createdUser: IUser = {
//         id: users.length + 1,
//         name: name,
//         email: email,
//         password: hashedPassword,
//         roles: roles
//       }

//       users.push(createdUser);

//       return await createdUser as Exclude<IUser, 'password'>;

//     } catch (err) {
//       console.log(err);
//     }
//   }

//   // delete() {
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
//   // update() {

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

// export default new UserService();