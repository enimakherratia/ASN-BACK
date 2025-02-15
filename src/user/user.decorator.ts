import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SECRET } from '../config';
import * as jwt from 'jsonwebtoken';

// Custom decorator to extract user from request or JWT
export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest(); // Get the request object

  // If the route is protected, the 'user' object will be set in the request by the AuthMiddleware
  if (!!req.user) {
    // If 'data' is provided, return the specific field from the user object, otherwise return the whole user object
    return !!data ? req.user[data] : req.user;
  }

  // If the route is not protected but we still want to get the user from the JWT token
  const token = req.headers.authorization ? (req.headers.authorization as string).split(' ') : null;

  // If token is found in the headers
  if (token && token[1]) {
    try {
      // Decode the JWT token using the secret key
      const decoded: any = jwt.verify(token[1], SECRET);
      // If 'data' is provided, return the specific field from the decoded token, otherwise return the whole user object
      return !!data ? decoded[data] : decoded.user;
    } catch (error) {
      // If the token is invalid or expired, return null or handle the error accordingly
      return null;
    }
  }

  return null; // If no user is found in the request or token, return null
});
