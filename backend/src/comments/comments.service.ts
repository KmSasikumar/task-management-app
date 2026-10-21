import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { withoutPassword } from '../common/sanitize-user';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CommentCreateInput) {
    const comment = await this.prisma.comment.create({
      data,
      include: { user: true },
    });
    return { ...comment, user: withoutPassword(comment.user) };
  }

  async remove(id: string) {
    return this.prisma.comment.delete({ where: { id } });
  }
}
