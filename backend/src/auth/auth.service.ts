import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async guestLogin() {
    let guestUser = await this.usersService.findByEmail('guest@pyramid.com');
    if (!guestUser) {
      guestUser = await this.usersService.create({
        name: 'Guest User',
        email: 'guest@pyramid.com',
        initials: 'GU',
        username: 'guestuser'
      });
    }
    return guestUser;
  }
}
