import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import * as argon2 from 'argon2';

// Defining the User interface, which will represent the structure of a user document
export interface User {
  username: string;  // Username of the user
  email: string;     // Email address of the user
  bio: string;       // Short biography of the user
  image: string;     // URL of the user's profile image
  password: string;  // Password of the user
}

// Extends the Mongoose Document to include Mongoose methods along with the User properties
export interface UserDocument extends User, Document {}

// Defining the User schema using Mongoose
export const userSchema = new mongoose.Schema<UserDocument>({
  username: { type: String, required: true },  // Username field, required
  email: { type: String, required: true, unique: true },  // Email field, required and unique
  bio: { type: String, default: '' },  // Bio field, default value is an empty string
  image: { type: String, default: '' },  // Image field, default value is an empty string
  password: { type: String, required: true },  // Password field, required
});

// Pre-save hook to hash the user's password before saving it to the database
userSchema.pre<UserDocument>('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    // Hash the password if it's modified or if the user is new
    this.password = await argon2.hash(this.password);
  }
  next();  // Proceed with saving the document
});
