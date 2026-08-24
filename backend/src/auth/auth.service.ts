import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async guestLogin() {
    let user = await this.usersService.findByEmail('Kommamani012@gmail.com');
    if (!user) {
      user = await this.usersService.create({
        name: 'Sasikumar',
        email: 'Kommamani012@gmail.com',
        initials: 'S',
      });
    }
    const { password, ...result } = user;
    return result;
  }

  async signup(email: string, pass: string, name: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new BadRequestException('Email already in use');
    }
    const hashedPassword = await bcrypt.hash(pass, 10);
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    
    const user = await this.usersService.create({
      email,
      name,
      password: hashedPassword,
      initials,
    });
    
    const { password, ...result } = user;
    return result;
  }

  async login(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const { password, ...result } = user;
    return result;
  }
}
