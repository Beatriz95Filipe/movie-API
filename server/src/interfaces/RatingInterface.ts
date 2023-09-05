import { Document, Types } from "mongoose";

export default interface IRating extends Document {
  movie: Types.ObjectId | string; //erro no ratingModel se não colocar aqui types.objectId
  user: Types.ObjectId | string; //erro no ratingModel se não colocar aqui types.objectId
  rating: number;
  comment: string | null;
}