import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.model';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import * as argon2 from 'argon2';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserRO } from "./user.interface";
import * as jwt from 'jsonwebtoken';
import { SECRET } from '../config';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  // Method to find a user by email and verify password during login
  async findOne({ email, password }: LoginUserDto): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      return null; // Return null if user not found
    }
    // Verify password using argon2 hash
    if (await argon2.verify(user.password, password)) {
      return user;
    }
    return null; // Return null if password doesn't match
  }

  // Method to create a new user
  async create(dto: CreateUserDto): Promise<UserRO> {
    const { username, email, password } = dto;

    // Check if the username or email already exists
    const existingUser = await this.userModel
      .findOne({
        $or: [{ username }, { email }],
      })
      .exec();

    if (existingUser) {
      // If username or email exists, throw an error
      const errors = { username: 'Username and email must be unique.' };
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Create a new user with the provided data
    const newUser = new this.userModel({
      username,
      email,
      password,
    });

    await newUser.save(); // Save the new user to the database

    return this.buildUserRO(newUser); // Return the response object
  }

  // Method to update a user's data
  async update(email: string, dto: UpdateUserDto): Promise<UserRO> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      return null; // Return null if user not found
    }

    // Assign new values to the user document
    Object.assign(user, dto);
    await user.save(); // Save the updated user
    return this.buildUserRO(user); // Return the updated user response object
  }

  // Method to find a user by their ID
  async findById(id: string): Promise<UserRO> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND); // Throw error if user not found
    }

    return this.buildUserRO(user); // Return user response object
  }

  // Method to find a user by their email
  async findByEmail(email: string): Promise<UserRO> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      return null; // Return message if user not found
    }
    return this.buildUserRO(user); // Return user response object
  }

  // Method to generate a JWT token for a user
  public generateJWT(user: User): string {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60); // Set expiration date to 60 days from today

    // Generate JWT token using user's information and secret key
    return jwt.sign(
      {
        username: user.username,
        email: user.email,
        exp: exp.getTime() / 1000,
      },
      SECRET,
    );
  }

  // Helper method to build the response object for a user
  private buildUserRO(user: User): UserRO {
    const userRO = {
      username: user.username,
      email: user.email,
      bio: user.bio,
      token: this.generateJWT(user),
      image: user.image,
    };

    return { user: userRO }; // Return the user response object
  }

  // Method to handle user logout (currently just returns a success message)
  async logout(userId: string): Promise<{ message: string }> {
    return { message: 'User logged out successfully' };
  }
}
