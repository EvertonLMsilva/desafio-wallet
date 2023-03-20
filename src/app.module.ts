import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.develop',
      isGlobal: true
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
