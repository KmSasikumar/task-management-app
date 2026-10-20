import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { sanitizeProject } from '../common/sanitize-user';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId?: string) {
    const where: Prisma.ProjectWhereInput = {};
    if (userId) {
      where.OR = [
        { leadId: userId },
        { members: { some: { id: userId } } }
      ];
    }
    
    const projects = await this.prisma.project.findMany({
      where,
      include: {
        lead: true,
        members: true
      }
    });
    return projects.map((pr) => sanitizeProject(pr));
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
    return sanitizeProject(project);
  }

  async create(data: Prisma.ProjectCreateInput) {
    const project = await this.prisma.project.create({ data, include: { lead: true, members: true } });
    return sanitizeProject(project);
  }

  async update(id: string, data: Prisma.ProjectUpdateInput) {
    const project = await this.prisma.project.update({ where: { id }, data, include: { lead: true, members: true } });
    return sanitizeProject(project);
  }

  async remove(id: string) {
    const project = await this.prisma.project.delete({ where: { id } });
    return sanitizeProject(project);
  }
}
