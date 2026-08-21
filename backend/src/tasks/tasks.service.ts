import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(projectId?: string) {
    const where = projectId ? { projectId } : {};
    return this.prisma.task.findMany({
      where,
      include: {
        reporter: true,
        members: true,
        subtasks: true,
        comments: { include: { user: true } }
      }
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        reporter: true,
        members: true,
        subtasks: true,
        comments: { include: { user: true } }
      }
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async create(data: Prisma.TaskCreateInput) {
    return this.prisma.task.create({
      data,
      include: { reporter: true, members: true, subtasks: true, comments: true }
    });
  }

  async update(id: string, data: Prisma.TaskUpdateInput) {
    return this.prisma.task.update({
      where: { id },
      data,
      include: { reporter: true, members: true, subtasks: true, comments: true }
    });
  }

  async remove(id: string) {
    return this.prisma.task.delete({ where: { id } });
  }
}
