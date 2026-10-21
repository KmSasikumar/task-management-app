import {
  BadRequestException,
  Controller,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { SubtasksService } from './subtasks.service';
import { Prisma } from '@prisma/client';

const STATUSES = ['todo', 'doing', 'completed', 'on-hold', 'backlog'];
const PRIORITIES = ['none', 'urgent', 'high', 'medium', 'low'];

function validateSubtask(data: Record<string, unknown>, isCreate: boolean) {
  if (!data || typeof data !== 'object') {
    throw new BadRequestException('Subtask payload is required');
  }
  if (
    isCreate &&
    (typeof data.title !== 'string' || data.title.trim() === '')
  ) {
    throw new BadRequestException('Subtask title is required');
  }
  if (data.status !== undefined && !STATUSES.includes(data.status as string)) {
    throw new BadRequestException(`Invalid status: ${String(data.status)}`);
  }
  if (data.priority !== undefined && !PRIORITIES.includes(data.priority as string)) {
    throw new BadRequestException(`Invalid priority: ${String(data.priority)}`);
  }
}

@Controller('subtasks')
export class SubtasksController {
  constructor(private readonly subtasksService: SubtasksService) {}

  @Post()
  create(@Body() data: Prisma.SubtaskCreateInput) {
    validateSubtask(data, true);
    return this.subtasksService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.SubtaskUpdateInput) {
    validateSubtask(data, false);
    return this.subtasksService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subtasksService.remove(id);
  }
}
