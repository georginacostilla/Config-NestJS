import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from '../../config/env-validation.config';
import { PrismaModule } from '../prisma/prisma.module';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ['.env'],
    validationSchema: envValidationSchema,
  }),
    PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
