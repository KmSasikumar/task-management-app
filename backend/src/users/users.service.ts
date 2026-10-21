import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { withoutPassword } from '../common/sanitize-user';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: {
    name: string;
    email: string;
    password?: string;
    avatar?: string;
    title?: string;
    username?: string;
    initials?: string;
  }) {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: any) {
    // Mass-assignment guard: previously the raw request body went straight
    // to Prisma, so PATCH {password: 'plaintext'} overwrote the stored
    // bcrypt hash with plaintext (breaking the original login and storing a
    // credential in the clear) and the hash/plaintext was returned in the
    // response. Only profile fields may be updated here; passwords are set
    // exclusively through signup (bcrypt-hashed).
    if (!data || typeof data !== 'object') {
      throw new BadRequestException('Update payload is required');
    }
    if ('password' in data) {
      throw new BadRequestException(
        'Password cannot be changed through this endpoint',
      );
    }
    const allowed = [
      'name',
      'email',
      'avatar',
      'title',
      'username',
      'initials',
    ];
    const body = data as Record<string, unknown>;
    const clean: Record<string, unknown> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) clean[key] = body[key];
    }
    if (typeof clean.name === 'string') {
      clean.name = clean.name.trim();
      if (clean.name === '')
        throw new BadRequestException('Name cannot be empty');
    }
    if (
      clean.email !== undefined &&
      (typeof clean.email !== 'string' ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email))
    ) {
      throw new BadRequestException('A valid email address is required');
    }
    if (Object.keys(clean).length === 0) {
      throw new BadRequestException('No updatable fields provided');
    }
    const user = await this.prisma.user.update({
      where: { id },
      data: clean,
    });
    return withoutPassword(user);
  }
}
