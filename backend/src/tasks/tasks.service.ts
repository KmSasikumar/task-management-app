import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { sanitizeTask } from '../common/sanitize-user';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(projectId?: string, userId?: string) {
    const where: Prisma.TaskWhereInput = {};
    if (projectId) where.projectId = projectId;
    if (userId) {
      where.OR = [
        { reporterId: userId },
        { members: { some: { id: userId } } },
      ];
    }

    const tasks = await this.prisma.task.findMany({
      where,
      include: {
        reporter: true,
        members: true,
        subtasks: true,
        comments: { include: { user: true } },
      },
    });
    return tasks.map((t) => sanitizeTask(t));
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        reporter: true,
        members: true,
        subtasks: true,
        comments: { include: { user: true } },
      },
    });
    if (!task) throw new NotFoundException('Task not found');
    return sanitizeTask(task);
  }

  async create(data: Prisma.TaskCreateInput) {
    const task = await this.prisma.task.create({
      data,
      include: {
        reporter: true,
        members: true,
        subtasks: true,
        comments: true,
      },
    });
    return sanitizeTask(task);
  }

  async update(id: string, data: Prisma.TaskUpdateInput) {
    const task = await this.prisma.task.update({
      where: { id },
      data,
      include: {
        reporter: true,
        members: true,
        subtasks: true,
        comments: true,
      },
    });
    return sanitizeTask(task);
  }

  async remove(id: string) {
    const task = await this.prisma.task.delete({ where: { id } });
    return sanitizeTask(task);
  }
}
