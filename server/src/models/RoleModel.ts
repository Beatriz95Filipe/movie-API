import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

export interface IRole extends mongoose.Document {
  name: string
}

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    uppercase: true,
    trim: true
  }
})

const RoleModel = mongoose.model<IRole>("Role", RoleSchema);

export { RoleModel };