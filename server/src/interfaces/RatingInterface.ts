import { Document, Types } from "mongoose";

interface IRating extends Document {
  movieId: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  rating: number;
  comment: string | null;
}

interface IRatingNumbers extends Document {
  totalRatings: number;
  averageRating: number;
}

export { IRating, IRatingNumbers };