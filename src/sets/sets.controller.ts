import { Controller, Get, Render, Query, Param, Req, Res } from '@nestjs/common';
import { SetsService } from './sets.service';
import type { Request, Response } from 'express';

@Controller('sets')
export class SetsController {
  constructor(private readonly setsService: SetsService) {}

  @Get()
  async getSets(@Query('search') search: string, @Req() req: Request, @Res() res: Response) {
    if (!req.session['isAuthenticated']) return res.redirect('/auth/login');
    
    const sets = await this.setsService.findAll(search);
    return res.render('sets/index', { sets, search: search || '' });
  }

  @Get(':id')
  async getSetDetail(@Param('id') id: number, @Req() req: Request, @Res() res: Response) {
    if (!req.session['isAuthenticated']) return res.redirect('/auth/login');

    const set = await this.setsService.findOne(id);
    return res.render('sets/detail', { set });
  }
}