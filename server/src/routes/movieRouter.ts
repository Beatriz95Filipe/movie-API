import express from "express";
import MovieController from "../controllers/MovieController.js";
import { isAdmin } from "../middlewares/AuthMiddleware.js";

//CRUD
const router = express.Router();

//GET ALL
router.get("/movies", MovieController.getAll);

//GET ONE
router.get("/movies/:id", MovieController.getOne);

//POST
router.post("/movies", MovieController.create);

//PUT
router.put("/movies/:id", MovieController.update);

//DELETE
router.delete("/movies/:id", isAdmin, MovieController.delete);

//POST RATING
router.post("/movies/rating", MovieController.rateMovie);

//GET ALL RATINGS
router.get("/movies/rating", MovieController.getAllRatings);

//GET RATINGS BY ID
router.get("/movies/rating/:id", MovieController.getRatingsById);

//DELETE RATING
router.delete("/movies/rating/:id", isAdmin, MovieController.deleteRating);

export default router;