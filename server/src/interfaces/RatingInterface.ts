import { Document, Types } from "mongoose";

export default interface IRating extends Document {
  movieId: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  rating: number;
  comment: string | null;
}