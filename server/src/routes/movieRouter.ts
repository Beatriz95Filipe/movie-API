import express from "express";
import MovieController from "../controllers/MovieController.js";

//CRUD
const router = express.Router();

//GET ALL
router.get("/movies", MovieController.getAll);

//GET ONE
router.get("/movies/:id", MovieController.getOne);

//POST
router.post("/movies", MovieController.create);

// //PUT
// router.put("/movies/:id", MovieController.update);

// //DELETE
// router.delete("/movies/:id", MovieController.delete);

export default router;