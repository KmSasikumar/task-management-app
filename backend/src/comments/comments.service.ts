import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CommentCreateInput) {
    return this.prisma.comment.create({ data, include: { user: true } });
  }

  async remove(id: string) {
    return this.prisma.comment.delete({ where: { id } });
  }
}
