import mongoose from "mongoose";
import {IRating} from "../interfaces/RatingInterface.js";

const RatingSchema = new mongoose.Schema<IRating>({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", //reference to UserModel
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
  },
});


const RatingModel = mongoose.model<IRating>("Rating", RatingSchema);

export default RatingModel;
