import { Controller, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SubtasksService } from './subtasks.service';
import { Prisma } from '@prisma/client';

@Controller('subtasks')
export class SubtasksController {
  constructor(private readonly subtasksService: SubtasksService) {}

  @Post()
  create(@Body() data: Prisma.SubtaskCreateInput) {
    return this.subtasksService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.SubtaskUpdateInput) {
    return this.subtasksService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subtasksService.remove(id);
  }
}
