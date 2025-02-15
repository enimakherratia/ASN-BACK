import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.model'; // Assure-toi d'avoir un bon schéma User et UserDocument
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import * as argon2 from 'argon2';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FindUserResponse, UserRO } from "./user.interface";
import * as jwt from 'jsonwebtoken';
import { SECRET } from '../config';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne({ email, password }: LoginUserDto): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      return null;
    }
    if (await argon2.verify(user.password, password)) {
      return user;
    }
    return null;
  }

  async create(dto: CreateUserDto): Promise<UserRO> {
    const { username, email, password } = dto;

    // Vérification de l'unicité du nom d'utilisateur et de l'email
    const existingUser = await this.userModel
      .findOne({
        $or: [{ username }, { email }],
      })
      .exec();

    if (existingUser) {
      const errors = { username: 'Username and email must be unique.' };
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Créer un nouvel utilisateur
    const newUser = new this.userModel({
      username,
      email,
      password,
    });

    await newUser.save();

    return this.buildUserRO(newUser);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      return null;
    }

    Object.assign(user, dto);
    await user.save();
    return user;
  }

  async delete(email: string): Promise<{ deleted: boolean }> {
    const result = await this.userModel.deleteOne({ email }).exec();
    return { deleted: result.deletedCount > 0 };
  }

  async findById(id: string): Promise<UserRO> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return this.buildUserRO(user);
  }

  async findByEmail(email: string): Promise<UserRO | FindUserResponse> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      return { message: 'User not found', user: null };
    }
    return this.buildUserRO(user);
  }

  public generateJWT(user: User): string {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        username: user.username,
        email: user.email,
        exp: exp.getTime() / 1000,
      },
      SECRET,
    );
  }

  private buildUserRO(user: User): UserRO {
    const userRO = {
      username: user.username,
      email: user.email,
      bio: user.bio,
      token: this.generateJWT(user),
      image: user.image,
    };

    return { user: userRO };
  }

  async logout(userId: string): Promise<{ message: string }> {
    return { message: 'User logged out successfully' };
  }
}
