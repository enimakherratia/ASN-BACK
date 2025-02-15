import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { userSchema } from './user.model';
import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [
    // Integrating Mongoose with the User schema for database interaction
    MongooseModule.forFeature([{ name: 'User', schema: userSchema }]),
  ],
  controllers: [UserController], // Assigning the controller to handle routes
  providers: [UserService], // Providing the service to handle the business logic
})
export class UserModule {
  // Configuring middlewares for the routes in this module
  public configure(consumer: MiddlewareConsumer) {
    // Applying the AuthMiddleware to the routes 'user' for GET and PUT methods
    consumer
      .apply(AuthMiddleware)
      .forRoutes({path: 'user', method: RequestMethod.GET}, {path: 'user', method: RequestMethod.PUT});
  }
}
