import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { existsSync } from "fs";
import { join } from "path";
import { AppModule } from "./app.module";

function resolveLaravelAnnexureBladesDir(): string | null {
  const candidates = [
    join(process.cwd(), "dist", "rating-config", "data", "laravel-annexure-blades"),
    join(process.cwd(), "src", "rating-config", "data", "laravel-annexure-blades"),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return null;
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(process.cwd(), "uploads"), { prefix: "/uploads/" });
  const laravelBlades = resolveLaravelAnnexureBladesDir();
  if (laravelBlades) {
    app.useStaticAssets(laravelBlades, { prefix: "/laravel-annexure-blades/" });
  }
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  const swaggerConfig = new DocumentBuilder()
    .setTitle("IGBC Auth API")
    .setDescription("Authentication and user APIs")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api-docs", app, swaggerDocument);
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
}

void bootstrap();
