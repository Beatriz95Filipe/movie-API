import IMovie from "../interfaces/MovieInterface.js";
import MovieModel from "../models/MovieModel.js";
import ApiError from "../utils/ApiError.js";

class MovieRepository {
    async createMovie(movieData: IMovie) {
        try {
            const newMovie = new MovieModel(movieData);
            // const savedMovie = await newMovie.save();
            // if(!savedMovie) {
            //     throw ApiError.InternalServerError("Error while creating movie.");
            // }
            // return savedMovie;
            return await newMovie.save();
        } catch (error) {
            throw error;
        }
    }
    async deleteMovie(id: string) {
        try {
            return await MovieModel.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
    async updateMovie(id: string, movieData: IMovie) {
        try {
            return await MovieModel.findByIdAndUpdate(id, movieData, { new:true });
        } catch (error) {
            throw error;
        }
    }
    async getMovieById(id: string) {
        try {
            return await MovieModel.findById(id);
        } catch (error) {
            throw error;
        }
    }
    async getAllMovies(query: any, page: number, limit: number, sortParams: {[key: string]: "asc" | "desc"}) {
        try {
            const skip = (page-1)*limit;
            const countPromise = MovieModel.countDocuments(query);
            const dataPromise = MovieModel.find(query)
            .sort(sortParams)
            .skip(skip)
            .limit(limit)
            const [totalMovies, movies] = await Promise.all([countPromise, dataPromise]);
            return {totalMovies, movies};
        } catch (error) {
            throw error;
        }
    }
}

export default new MovieRepository();