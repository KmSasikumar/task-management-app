import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Prisma } from '@prisma/client';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Query('projectId') projectId?: string) {
    return this.tasksService.findAll(projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  create(@Body() data: Prisma.TaskCreateInput) {
    return this.tasksService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.TaskUpdateInput) {
    return this.tasksService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
