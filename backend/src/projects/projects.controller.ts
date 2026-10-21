import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Headers,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Prisma } from '@prisma/client';

const PRIORITIES = ['none', 'urgent', 'high', 'medium', 'low'];

function validateProject(data: Record<string, unknown>, isCreate: boolean) {
  if (!data || typeof data !== 'object') {
    throw new BadRequestException('Project payload is required');
  }
  if (isCreate && (typeof data.name !== 'string' || data.name.trim() === '')) {
    throw new BadRequestException('Project name is required');
  }
  if (data.priority !== undefined && !PRIORITIES.includes(data.priority as string)) {
    throw new BadRequestException(`Invalid priority: ${String(data.priority)}`);
  }
}

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll(@Headers('x-user-id') userId?: string) {
    return this.projectsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Post()
  create(
    @Body() data: Prisma.ProjectCreateInput,
    @Headers('x-user-id') userId?: string,
  ) {
    validateProject(data, true);
    if (userId) {
      data.lead = { connect: { id: userId } };
    }
    return this.projectsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.ProjectUpdateInput) {
    validateProject(data, false);
    return this.projectsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
