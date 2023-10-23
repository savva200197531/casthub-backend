import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.setGlobalPrefix("api");

  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>("PORT");

  console.log("port", port);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(port, () => {
    console.log("[WEB]", `http://localhost:${port}`);
  });
}

bootstrap();
