import { Strategy, ExtractJwt } from "passport-jwt";

import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { UsersService } from "../../users/users.service";
import { JwtRefreshTokenStrategy } from "./jwt-refresh-token.strategy";
import { JwtPayload } from "../jwt-payload.interface";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtRefreshTokenStrategy.name);

  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
    @Inject(ConfigService) private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET"),
    });
    this.logger.warn("JwtStrategy initialized");
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
