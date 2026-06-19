import { Controller, Post, ForbiddenException } from '@nestjs/common';
import { SeederService } from './seeder.service';

@Controller('api/seed')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post()
  async seed(): Promise<{ message: string }> {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('Seeding is not allowed in production');
    }

    await this.seederService.seed();
    return { message: 'Seeding completed successfully' };
  }
}
