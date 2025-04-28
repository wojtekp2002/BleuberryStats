import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { HarvestModule } from './harvest/harvest.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/BleuberryStats'),
    AuthModule,
    HarvestModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}