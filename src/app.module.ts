import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PublicApiModule } from './public-api/public-api.module';
import { dsOptions } from './database/ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    TypeOrmModule.forRoot(dsOptions),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PublicApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  static port: string;
  constructor(private configService: ConfigService) {
    AppModule.port = this.configService.get<string>('PORT');
  }
}
