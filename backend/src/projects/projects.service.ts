import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.project.findMany({
      include: {
        lead: true,
        members: true
      }
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        lead: true,
        members: true,
        tasks: {
          include: {
            members: true,
            subtasks: true,
            comments: { include: { user: true } }
          }
        }
      }
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async create(data: Prisma.ProjectCreateInput) {
    return this.prisma.project.create({ data, include: { lead: true, members: true } });
  }

  async update(id: string, data: Prisma.ProjectUpdateInput) {
    return this.prisma.project.update({ where: { id }, data, include: { lead: true, members: true } });
  }

  async remove(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }
}
