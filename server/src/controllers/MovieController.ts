import { NextFunction, Request, Response } from "express";
import IMovie from "../interfaces/MovieInterface.js";
import MovieService from "../services/MovieService.js";
import ApiError from "../utils/ApiError.js";
import MovieRepository from "../repositories/MovieRepository.js";
import { IRating, IRatingNumbers } from "../interfaces/RatingInterface.js";
import RatingModel from "../models/RatingModel.js";
import FileService from "../services/FileService.js";
import path from 'path';

class MovieController {
    //create movie - post
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { title, releaseDate, filmDirector, trailerLink, genres } = req.body;
            const moviePoster = req.files?.image;
            let finalPoster = "no-movie-image.png";
            console.log("movieposter", moviePoster);
            console.log("finalposter", finalPoster);

            if (moviePoster) {
                finalPoster = await FileService.save(moviePoster);
            }

            if (!title || !releaseDate || !filmDirector || !trailerLink || !genres) {
                throw new Error("Missing required fields.");
            }

            const newMovie = {
                title,
                releaseDate,
                filmDirector,
                trailerLink,
                posterUrl: finalPoster,
                genres
            } as IMovie;

            const savedMovie = await MovieService.createMovie(newMovie);

            res.status(201).json(savedMovie);
        } catch (error) {
            console.log("movieContrellerError create:", error);
            next(error);
        }
    }

    //get all
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const fetchAll = req.query.fetchAll === "true"; //fetch all movies to searchBar
            const page = parseInt(req.query.page as string) || 1;
            let limit = parseInt(req.query.limit as string) || 12;
            const sortBy = req.query.sortBy as string || "releaseDate";
            const sortOrder = req.query.sortOrder as string || "desc";
            const titleFilter = req.query.title as string | undefined;
            const releaseDateFilter = req.query.year as string | undefined;
            const filmDirectorFilter = req.query.director as string[] | undefined;
            const genresFilter = req.query.genres as string[] | undefined;

            const genres = await MovieService.getGenres();
            const years = await MovieService.getYears();
            const directors = await MovieService.getFilmDirectors();

            const filterOptions = {
                genres,
                years,
                directors
            }

            let movies;

            if(fetchAll){
                movies = await MovieService.getAllMovies(
                    page,
                    limit = parseInt(req.query.limit as string) || 900,
                    sortBy,
                    sortOrder,
                    titleFilter,
                    releaseDateFilter,
                    filmDirectorFilter,
                    genresFilter
                );
            } else {
                movies = await MovieService.getAllMovies(
                    page,
                    limit,
                    sortBy,
                    sortOrder,
                    titleFilter,
                    releaseDateFilter,
                    filmDirectorFilter,
                    genresFilter
                );
            }

            for (let i = 0; i < movies.movies.length; i++) {
                const fullImageUrl = `${req.protocol}://${req.get("host")}/${movies.movies[i]?.posterUrl}`;
                movies.movies[i].posterUrl = fullImageUrl;
            }
            const response = {movies, filterOptions};
            res.json(response);
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

            const fullImageUrl = `${req.protocol}://${req.get("host")}/${movie?.posterUrl}`;
            const movieWithImageUrl = {
                ...movie?.toJSON(),
                posterUrl: fullImageUrl,
            }

            res.status(200).json(movieWithImageUrl);
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
            const { title, releaseDate, filmDirector, trailerLink, genres } = req.body;
            const moviePoster = req.files?.image;
            // let posterUrl = req.body.posterUrl;
            console.log("movieposter", moviePoster);

            const existingMovie: IMovie | null = await MovieRepository.getMovieById(id);

            if (!existingMovie) {
                res.status(404).json({message: "Movie not found"});
            }

            if (existingMovie) {
                if (existingMovie.posterUrl && existingMovie.posterUrl !== "no-movie-image.png") {
                    await FileService.delete(existingMovie.posterUrl);
                }

                let finalPoster = "no-movie-image.png";
                console.log("finalposter", finalPoster);

                if (moviePoster) {
                    finalPoster = await FileService.save(moviePoster);
                }

                const updateMovie = {
                    title,
                    releaseDate,
                    filmDirector,
                    trailerLink,
                    posterUrl: finalPoster,
                    genres
                } as IMovie;

                const updatedMovie = await MovieRepository.updateMovie(id, updateMovie);
                if (!updatedMovie) {
                    throw ApiError.NotFoundError(`Movie not found for ${id}`);
                }

                res.status(200).json(updatedMovie);
            }
        } catch (error) {
            console.log("movieContrellerError update:", error);
            next(error);
        }
    }

    //get genres
    async getGenres(req: Request, res: Response, next: NextFunction) {
        try {
            const genres = await MovieService.getGenres();
            res.status(200).json(genres);
        } catch (error) {
            next(error);
        }
    }

    //get years
    async getYears(req: Request, res: Response, next: NextFunction) {
        try {
            const years = await MovieService.getYears();
            res.status(200).json(years);
        } catch (error) {
            next(error);
        }
    }

    //get film directors
    async getFilmDirectors(req: Request, res: Response, next: NextFunction) {
        try {
            const directors = await MovieService.getFilmDirectors();
            res.status(200).json(directors);
        } catch (error) {
            next(error);
        }
    }

    //post rating
    async rateMovie(req: Request, res: Response, next: NextFunction) {
        try {
            const { movieId, userId, rating, comment } = req.body;

            const newRating = {
                movieId,
                userId,
                rating,
                comment
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
            // if(allRatings.length === 0) {
            //     throw ApiError.NotFoundError("No ratings found.");
            // }
            // console.log(allRatings);
            res.json(allRatings);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async getRatingsById(req: Request, res: Response, next: NextFunction){
        try {
            const { movieId } = req.params;
            console.log("movieId:", movieId);
            const ratings = await MovieService.getRatingsById(movieId);
            if (!ratings) {
                throw ApiError.NotFoundError(`Ratings not found for ${movieId}`);
            }

            console.log(ratings);
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