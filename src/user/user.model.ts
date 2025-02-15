import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import * as argon2 from 'argon2';

export interface User {
  username: string;
  email: string;
  bio: string;
  image: string;
  password: string;
}

// Étend Document pour inclure les méthodes de Mongoose
export interface UserDocument extends User, Document {}

export const userSchema = new mongoose.Schema<UserDocument>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bio: { type: String, default: '' },
  image: { type: String, default: '' },
  password: { type: String, required: true },
});

userSchema.pre<UserDocument>('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    this.password = await argon2.hash(this.password);
  }
  next();
});
