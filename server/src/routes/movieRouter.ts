import express from "express";
import MovieController from "../controllers/MovieController.js";
import { authMiddleware, isAdmin } from "../middlewares/AuthMiddleware.js";

//CRUD
const router = express.Router();

//GET ALL
router.get("/movies", MovieController.getAll);

//GET ONE
router.get("/movies/:id", MovieController.getOne);


//GET GENRES
router.get("/genres", MovieController.getGenres);

//GET YEARS
router.get("/years", MovieController.getYears);

//GET FILM DIRECTORS
router.get("/directors", MovieController.getFilmDirectors);


//POST
router.post("/movies", isAdmin, MovieController.create);

//PUT
router.put("/movies/:id", MovieController.update);

//DELETE
router.delete("/movies/:id", isAdmin, MovieController.delete);

//POST RATING
router.post("/ratings", authMiddleware, MovieController.rateMovie);

//GET ALL RATINGS
router.get("/ratings", MovieController.getAllRatings);

//GET RATINGS BY ID
router.get("/ratings/:movieId", MovieController.getRatingsById);

//DELETE RATING
router.delete("/ratings/:movieId", isAdmin, MovieController.deleteRating);

export default router;