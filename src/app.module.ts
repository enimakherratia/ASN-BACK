import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    ProductsModule,
    MongooseModule.forRoot('mongodb://localhost:27017/ASNTEST'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
