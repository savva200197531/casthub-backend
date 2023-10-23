import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { UsersModule } from "../users/users.module";
import { User } from "../users/entities/user.entity";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { UsersService } from "../users/users.service";
import { RefreshTokenIdsStorage } from "./refresh-token-ids-storage";
import { LocalStrategy } from "./strategy/local.strategy";
import { JwtRefreshTokenStrategy } from "./strategy/jwt-refresh-token.strategy";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get("JWT_SECRET"),
        signOptions: { expiresIn: config.get("JWT_EXPIRES") },
      }),
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    UsersService,
    RefreshTokenIdsStorage,
    LocalStrategy,
    JwtRefreshTokenStrategy,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
