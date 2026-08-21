import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubtasksService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.SubtaskCreateInput) {
    return this.prisma.subtask.create({ data });
  }

  async update(id: string, data: Prisma.SubtaskUpdateInput) {
    return this.prisma.subtask.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.subtask.delete({ where: { id } });
  }
}
