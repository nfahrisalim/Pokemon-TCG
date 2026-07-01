import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import session from 'express-session';
import { SeederService } from './seeder/seeder.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  app.use(
    session({
      secret: 'my-super-secret-key',
      resave: false,
      saveUninitialized: false,
    }),
  );

  if (process.env.NODE_ENV !== 'production') {
    try {
      await app.get(SeederService).seed();
      console.log('[Bootstrap] Seeder completed successfully');
    } catch (error) {
      console.error('[Bootstrap] Seeder failed:', error);
    }
  }

  await app.listen(3000);
}
bootstrap();