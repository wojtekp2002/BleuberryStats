import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); 
  const port = process.env.PORT || 3001;
  await app.listen(port, () => {
    console.log(`Aplikacja NestJS działa na porcie ${port}`);
  });
}
bootstrap();
