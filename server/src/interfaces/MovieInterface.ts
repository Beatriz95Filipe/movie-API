import { Document } from "mongoose";

export default interface IMovie extends Document{
    title: string;
    releaseDate: Date;
    filmDirector: string[];
    trailerLink: string;
    posterUrl: string;
    genres: string[];
}