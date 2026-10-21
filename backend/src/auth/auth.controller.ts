import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('guest')
  guestLogin() {
    return this.authService.guestLogin();
  }

  @Post('signup')
  async signup(@Body() body: any) {
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!email || !password || !name) {
      throw new BadRequestException('Email, password, and name are required');
    }
    // Previously any non-empty strings were accepted: malformed emails,
    // one-character passwords and whitespace-only names all created accounts.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestException('A valid email address is required');
    }
    if (password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }
    return this.authService.signup(email, password, name);
  }

  @Post('login')
  async login(@Body() body: any) {
    if (!body.email || !body.password) {
      throw new BadRequestException('Email and password are required');
    }
    const user = await this.authService.login(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
