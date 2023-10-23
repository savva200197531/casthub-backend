import { Injectable, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from "@nestjs/typeorm";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "postgres",
      host: this.configService.get<string>("POSTGRES_HOST"),
      port: this.configService.get<number>("POSTGRES_PORT"),
      database: this.configService.get<string>("POSTGRES_DATABASE"),
      username: this.configService.get<string>("POSTGRES_USERNAME"),
      password: this.configService.get<string>("POSTGRES_PASSWORD"),
      entities: ["dist/**/*.entity.{ts,js}"],
      migrations: ["dist/migrations/*.{ts,js}"],
      migrationsTableName: "typeorm_migrations",
      logger: "file",
      synchronize: true, // never use TRUE in production!
    };
  }
}
