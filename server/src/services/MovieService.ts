import IMovie from "../interfaces/MovieInterface.js";
import IRating from "../interfaces/RatingInterface.js";
import MovieRepository from "../repositories/MovieRepository.js";
import RatingModel from "../models/RatingModel.js";
import { Types } from "mongoose";

class MovieService {
    async createMovie(movieData: IMovie) {
        try {
            const savedMovie = await MovieRepository.createMovie(movieData);
            return savedMovie;
        } catch (error) {
            throw new Error("Failed to create movie.");
        }
    }

    async getAllMovies(page: number, limit: number, sortBy: string, sortOrder: string, filters: any) {
        try {
            const sortParams: { [key: string]: "asc" | "desc" } = {
                [sortBy]: sortOrder === "desc" ? "desc" : "asc"
            }
            let totalMovies = 0;
            const defaultQuery: any = {};

            for (const key in filters) {
                if (filters.hasOwnProperty(key)) {
                    const value = filters[key];
                    if (key === "title") {
                        defaultQuery[key] = { $regex: value, $options: "i" };
                    } else if (key === "genres" && Array.isArray(value) && value.length > 0) {
                        const validGenres = value.filter((genre: string) => genre.trim() !== "");
                        if (validGenres.length > 0) {
                            defaultQuery[key] = { $all: validGenres };
                        }
                    } else if (key === "year") {
                        defaultQuery["releaseDate"] = {
                            $gte: new Date(`${value}-01-01`),
                            $lt: new Date(`${parseInt(value) + 1}-01-01`),
                        }
                    } else {
                        defaultQuery[key] = value;
                    }
                }
            }

            const result = await MovieRepository.getAllMovies(defaultQuery, page, limit, sortParams);

            const responseData = {
                movies: result.movies,
                currentPage: page,
                totalPages: Math.ceil(result.totalMovies / limit)
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

    //POST create rating
    async rateMovie(
        rating: IRating,
    ) {
        try {
            const ratedMovie = await RatingModel.create(rating);

            const savedRating: IRating | null = await RatingModel.findById(ratedMovie._id)
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

    async getRatingsById(movieId: Types.ObjectId | string): Promise<IRating[]> {
        try {
            const ratings = await RatingModel.find({movieId});
            return ratings;
        } catch (error) {
            throw new Error(`Ratings not found for ${movieId}`);
        }
    }
}

export default new MovieService();