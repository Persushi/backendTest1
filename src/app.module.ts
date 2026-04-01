import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/challenge'),
    AuthModule,
    LocationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
