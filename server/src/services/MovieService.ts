import IMovie from "../interfaces/MovieInterface.js";
import { IRating, IRatingNumbers } from "../interfaces/RatingInterface.js";
import MovieRepository from "../repositories/MovieRepository.js";
import RatingModel from "../models/RatingModel.js";
import { Types } from "mongoose";
import MovieModel from "../models/MovieModel.js";

class MovieService {
    async createMovie(movieData: IMovie) {
        try {
            const savedMovie = await MovieRepository.createMovie(movieData);
            return savedMovie;
        } catch (error) {
            throw new Error("Failed to create movie.");
        }
    }

    async getAllMovies(
        page: number,
        limit: number,
        sortBy: string,
        sortOrder: string,
        titleFilter: string | undefined,
        releaseDateFilter: string | undefined,
        filmDirectorFilter: string[] | undefined,
        genresFilter: string[] | undefined
    ) {
        try {
            const sortParams: { [key: string]: "asc" | "desc" } = {
                [sortBy]: sortOrder === "desc" ? "desc" : "asc"
            }

            const defaultQuery: any = {};

            if(titleFilter) {
                defaultQuery["title"] = { $regex: titleFilter, $options: "i" };
            }

            if(releaseDateFilter) {
                defaultQuery["releaseDate"] = {
                    $gte: new Date(`${releaseDateFilter}-01-01`),
                    $lt: new Date(`${parseInt(releaseDateFilter) + 1}-01-01`),
                };
            }

            if (filmDirectorFilter && filmDirectorFilter.length > 0) {
                defaultQuery["filmDirector"] = { $all: filmDirectorFilter };
            }

            if (genresFilter && genresFilter.length > 0) {
                defaultQuery["genres"] = { $all: genresFilter };
            }

            const result = await MovieRepository.getAllMovies(defaultQuery, page, limit, sortParams);

            const responseData = {
                movies: result.movies,
                currentPage: page,
                totalPages: Math.ceil(result.totalMovies / limit),
            };
            return responseData;
        } catch (error) {
            throw new Error("Failed to get movies.");
        }
    }

    async getMovieById(id: string) {
        try {
            const movie = await MovieRepository.getMovieById(id);
            return movie;
        } catch (error) {
            throw new Error(`Movie not found for ${id}`);
        }
    }

    //get genres
    async getGenres() {
        try {
            const genres = await MovieModel.distinct("genres");
            return genres;
        } catch (error) {
            throw new Error("Failed to get genres.");
        }
    }

    //get years
    async getYears() {
        try {
            const years = await MovieModel.distinct("releaseDate");
            return years;
        } catch (error) {
            throw new Error("Failed to get years.");
        }
    }

    //get film directors
    async getFilmDirectors() {
        try {
            const directors = await MovieModel.distinct("filmDirector");
            return directors;
        } catch (error) {
            throw new Error("Failed to get film directors.");
        }
    }

    //POST create rating
    async rateMovie(
        rating: IRating,
    ): Promise<IRating | null> {
        try {
            const ratedMovie = await RatingModel.create(rating);

            const savedRating = await RatingModel.findById(ratedMovie._id)
            .populate({
                path: "movieId", //reference document
                select: "title", //only title
              })
            .populate({
                path: "userId", //reference document
                select: "name", //only name
              })

            console.log(savedRating);

            return savedRating;
        } catch (error) {
            console.log(error);
            throw new Error("Failed to create rating.");
        }
    }

    // Get All Ratings
    async getAllRatings(): Promise<IRating[]> {
        try {
            const allRatings = await RatingModel.find();
            console.log(allRatings);
            return allRatings;
        } catch (error) {
            console.log(error);
            throw new Error("Cannot get ratings.");
        }
    }

    async getRatingsById(movieId: Types.ObjectId | string): Promise<{ ratings: IRating[], totalRatings: number, averageRating: number }>{
        try {
            const ratings = await RatingModel.find({movieId});

            const totalRatings = ratings.length;
            if (totalRatings === 0) {
                return { ratings: [], averageRating: 0, totalRatings: 0 };
            }

            const sumRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
            const averageRating = sumRating / totalRatings;

            return {ratings, averageRating, totalRatings};
        } catch (error) {
            console.log(error);
            throw new Error(`Ratings not found for ${movieId}`);
        }
    }
}

export default new MovieService();