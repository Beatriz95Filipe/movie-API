import express from "express";
import AuthController from "./../controllers/AuthController.js";
import { authMiddleware, isAdmin} from "./../middlewares/AuthMiddleware.js";
import { check } from "express-validator";

//CRUD
const router = express.Router();

//POST - CREATE ROLES
router.post(
  "/roles",
  [
    check("name", "Name can't be empty").notEmpty(),
  ],
  AuthController.createRole
);

//DELETE ROLES
router.delete("/roles/:id", isAdmin, AuthController.deleteRole);

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//POST REGISTER
router.post(
  "/register",
  [
    check("name", "Name can't be empty").notEmpty(),
    check("email", "Email can't be empty").notEmpty(),
    check("email", "Invalid email").isEmail(),
    check("password").notEmpty().withMessage("Password is required")
    .matches(passwordRegex).withMessage("Password must be safe and secure"),
  ],
  AuthController.register
);

//POST LOGIN
router.post(
  '/login',
  [
    check("email", "Email can't be empty").notEmpty(),
    check("email", "Invalid email").isEmail(),
    check("password", "Password is required").notEmpty(),
  ],
  AuthController.login
);

//GET
router.get(
  '/',
  authMiddleware,
  AuthController.getAll
);

export default router;