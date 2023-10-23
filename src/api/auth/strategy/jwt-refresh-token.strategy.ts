import { ExtractJwt, Strategy } from "passport-jwt";

import { PassportStrategy } from "@nestjs/passport";
import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { UsersService } from "../../users/users.service";
import { JwtPayload } from "../jwt-payload.interface";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh-token",
) {
  private readonly logger = new Logger(JwtRefreshTokenStrategy.name);

  constructor(
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(UsersService) private usersService: UsersService,
    @Inject(ConfigService) private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET"),
    });
    this.logger.warn("JwtRefreshTokenStrategy initialized");
  }

  async validate(payload: JwtPayload): Promise<any> {
    this.logger.warn(`Payload: ${JSON.stringify(payload)}`);
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      this.logger.error("User not found");
      throw new UnauthorizedException();
    }
    return user;
  }
}
