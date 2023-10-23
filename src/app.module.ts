import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "@hapi/joi";

import { ApiModule } from "./api/api.module";
import { TypeOrmConfigService } from "./shared/typeorm/typeorm.service";
import { getEnvPath } from "./common/helper/env.helper";

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

console.log(envFilePath);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      validationSchema: Joi.object({
        JWT_EXPIRES: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.string().required(),
        POSTGRES_USERNAME: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DATABASE: Joi.string().required(),
      }),
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ApiModule,
  ],
})
export class AppModule {}
