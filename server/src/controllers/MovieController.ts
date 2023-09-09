import { NextFunction, Request, Response } from "express";
import IMovie from "../interfaces/MovieInterface.js";
import MovieService from "../services/MovieService.js";
import ApiError from "../utils/ApiError.js";
import MovieModel from "../models/MovieModel.js";
import MovieRepository from "../repositories/MovieRepository.js";
import IRating from "../interfaces/RatingInterface.js";
import RatingModel from "../models/RatingModel.js";

class MovieController {
    //create movie - post
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { title, releaseDate, filmDirector, trailerLink, posterUrl, genres } = req.body;

            const newMovie = {
                title,
                releaseDate,
                filmDirector,
                trailerLink,
                posterUrl,
                genres
            } as IMovie;

            const savedMovie = await MovieService.createMovie(newMovie);

            res.status(201).json(savedMovie);
        } catch (error) {
            next(error);
        }
    }

    //get all
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const sortBy = req.query.sortBy as string || "releaseDate";
            const sortOrder = req.query.sortOrder as string || "desc";
            const filtersQuery = req.query.filters as string | undefined;

            let filters: any = {};

            if (filtersQuery) {
                try {
                    filters = JSON.parse(decodeURIComponent(filtersQuery));
                } catch (error) {
                    return next(ApiError.BadRequestError("Invalid filters JSON"));
                }
            }

            const movies = await MovieService.getAllMovies(page, limit, sortBy, sortOrder, filters);
            res.json(movies);
        } catch (error) {
            next(error);
        }
    }

    //get one
    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const movie = await MovieService.getMovieById(id);
            if (!movie) {
                throw ApiError.NotFoundError(`Movie not found for ${id}`);
            }

            res.status(200).json(movie);
        } catch (error) {
            next(error);
        }
    }

    //delete movie
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const deletedMovie = await MovieRepository.deleteMovie(id);
            if (!deletedMovie) {
                throw ApiError.NotFoundError(`Movie not found for ${id}`);
            }

            res.status(200).json(deletedMovie);
        } catch (error) {
            next(error);
        }
    }

    //update movie
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { title, releaseDate, filmDirector, trailerLink, posterUrl, genres } = req.body;

            const updateMovie = {
                title,
                releaseDate,
                filmDirector,
                trailerLink,
                posterUrl,
                genres
            } as IMovie;

            const updatedMovie = await MovieRepository.updateMovie(id, updateMovie);
            if (!updatedMovie) {
                throw ApiError.NotFoundError(`Movie not found for ${id}`);
            }

            res.status(200).json(updatedMovie);
        } catch (error) {
            next(error);
        }
    }

    //post rating
    async rateMovie(req: Request, res: Response, next: NextFunction) {
        try {
            const { movieId, userId, rating, comment } = req.body;

            const newRating = {
                movieId, userId, rating, comment
            } as IRating;

            const savedRating = await MovieService.rateMovie(newRating);

            res.status(201).json(savedRating);
        } catch (error) {
            next(error);
        }
    }

    //get all ratings
    async getAllRatings(req: Request, res: Response, next: NextFunction) {
        try {
            const allRatings = await MovieService.getAllRatings();
            if(!allRatings) {
                throw ApiError.NotFoundError("Cannot get ratings");
            }
            console.log(allRatings);
            res.json(allRatings);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async getRatingsById(req: Request, res: Response, next: NextFunction){
        try {
            const { movieId } = req.params;
            const ratings = await MovieService.getRatingsById(movieId);
            if (!ratings) {
                throw ApiError.NotFoundError(`Ratings not found for ${movieId}`);
            }

            res.status(200).json(ratings);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    //delete rating
    async deleteRating(req: Request, res: Response, next: NextFunction) {
        try {
            const ratingId = req.params.id;

            const deletedRating: IRating | null = await RatingModel.findByIdAndDelete(ratingId);
            if (!deletedRating) {
                throw ApiError.NotFoundError("Rating not found");
            }

            res.status(200).json(deletedRating);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

export default new MovieController();