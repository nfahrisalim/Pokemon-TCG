import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  getRoot(@Res() res: Response) {
    return res.redirect('/auth/login');
  }
}
