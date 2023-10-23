import { Body, Controller, Post, UseGuards, Headers } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { Public } from "./decorators/public.decorator";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { SignInDto } from "./dto/sign-in.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { JwtRefreshTokenGuard } from "./guards/jwt-refresh-token.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RegisterUserDto } from "../users/dto/register-user.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post("sign-up")
  async signUp(@Body() registerUserDto: RegisterUserDto) {
    return this.usersService.create(registerUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("sign-in")
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post("refresh-token")
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto.refresh_token);
  }

  @UseGuards(JwtAuthGuard)
  @Post("invalidate-token")
  async invalidateToken(@Headers("authorization") authorization: string) {
    const token = authorization.split(" ")[1];
    await this.authService.invalidateToken(token);
    return { message: "Token invalidated successfully" };
  }
}
