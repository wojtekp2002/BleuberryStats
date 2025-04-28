import { Module } from '@nestjs/common';
import { HarvestService } from './harvest.service';
import { HarvestController } from './harvest.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Harvest, HarvestSchema } from 'src/schemas/harvest.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Harvest.name, schema: HarvestSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [HarvestService],
  controllers: [HarvestController],
})

export class HarvestModule {}