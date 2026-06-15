import { Controller, Get, Render, Query, Param, Req, Res } from '@nestjs/common';
import { CardsService } from './cards.service';
import type { Request, Response } from 'express';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  async getCards(@Query('search') search: string, @Req() req: Request, @Res() res: Response) {
    if (!req.session['isAuthenticated']) return res.redirect('/auth/login');
    
    const cards = await this.cardsService.findAll(search);
    return res.render('cards/index', { cards, search: search || '' });
  }

  @Get(':id')
  async getCardDetail(@Param('id') id: number, @Req() req: Request, @Res() res: Response) {
    if (!req.session['isAuthenticated']) return res.redirect('/auth/login');

    const card = await this.cardsService.findOne(id);
    return res.render('cards/detail', { card });
  }
}