import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NestMiddleware, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { SECRET } from '../config';
import { UserService } from './user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  // Middleware to authenticate users via JWT
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization; // Extract authorization header

    // Check if authorization header is present and token exists
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1]; // Get the token from the header
      try {
        const decoded: any = jwt.verify(token, SECRET); // Decode the token to extract user data

        // Look up the user in the database using the decoded email
        const user = await this.userService.findByEmail(decoded.email);

        // If the user is not found, throw an error
        if (!user) {
          throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
        }

        // Attach the user data to the request object for later use
        (req as any).user = user.user;
        next(); // Proceed to the next middleware or route handler
      } catch (error) {
        throw new HttpException('Invalid or expired token.', HttpStatus.UNAUTHORIZED);
      }
    } else {
      // If the token is missing, throw an unauthorized error
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }
}
