import { Controller, Get, Post, Render, Req, Res, Body } from '@nestjs/common';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  
  @Get('login')
  @Render('auth/login')
  getLoginPage() {
    return { error: null }; 
  }

  @Post('login')
  login(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    const { username, password } = body;

    if (username === 'admin' && password === 'password123') {
      req.session['isAuthenticated'] = true;
      return res.redirect('/sets');
    }

    return res.render('auth/login', { error: 'Invalid credentials!' });
  }

  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy(() => {
      res.redirect('/auth/login');
    });
  }
}