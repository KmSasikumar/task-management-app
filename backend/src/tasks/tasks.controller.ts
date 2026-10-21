import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Prisma } from '@prisma/client';

const STATUSES = ['todo', 'doing', 'completed', 'on-hold', 'backlog'];
const PRIORITIES = ['none', 'urgent', 'high', 'medium', 'low'];

// The frontend (frontend/src/lib/types.ts + api.ts) sends Task objects in its
// own shape: members/reporter are plain id strings, labels is a string array,
// dueDate is '' when unset, and the payload carries subtasks/comments/
// createdAt/updatedAt. Prisma rejects that shape, so every frontend task
// create/update failed with a 500. Translate it to Prisma input here, and
// validate the scalar fields the DB stores as free strings.
function normalizeTaskPayload(
  raw: any,
  isUpdate: boolean,
): Prisma.TaskCreateInput & Prisma.TaskUpdateInput {
  if (!raw || typeof raw !== 'object') {
    throw new BadRequestException('Task payload is required');
  }
  const data: Record<string, unknown> = { ...raw };

  if (
    !isUpdate &&
    (typeof data.title !== 'string' || data.title.trim() === '')
  ) {
    throw new BadRequestException('Task title is required');
  }
  if (typeof data.title === 'string') data.title = data.title.trim();
  if (data.status !== undefined && !STATUSES.includes(data.status as string)) {
    throw new BadRequestException(`Invalid status: ${String(data.status)}`);
  }
  if (
    data.priority !== undefined &&
    !PRIORITIES.includes(data.priority as string)
  ) {
    throw new BadRequestException(`Invalid priority: ${String(data.priority)}`);
  }

  // labels: frontend string[] <-> backend comma-separated string
  if (Array.isArray(data.labels)) {
    data.labels = (data.labels as unknown[]).map(String).join(',');
  }
  // dueDate: '' means unset on the frontend
  if (data.dueDate === '') data.dueDate = null;
  // members: frontend sends an array of user ids
  if (Array.isArray(data.members)) {
    const ids = (data.members as unknown[]).map(String);
    data.members = isUpdate
      ? { set: ids.map((id) => ({ id })) }
      : { connect: ids.map((id) => ({ id })) };
  }
  // reporter: frontend sends a plain user id
  if (typeof data.reporter === 'string') {
    data.reporter = { connect: { id: data.reporter } };
  }
  // projectId: Prisma's checked create/update input rejects the scalar FK
  // (an explicit `projectId: null` fails validation), so translate it to
  // the project relation.
  if ('projectId' in data) {
    const pid = data.projectId;
    delete data.projectId;
    if (typeof pid === 'string' && pid) {
      data.project = { connect: { id: pid } };
    } else if (pid === null && isUpdate) {
      data.project = { disconnect: true };
    }
  }
  // Managed through their own endpoints / server-generated; never accepted
  // from the client payload.
  if (isUpdate) delete data.id;
  delete data.subtasks;
  delete data.comments;
  delete data.createdAt;
  delete data.updatedAt;
  return data as Prisma.TaskCreateInput & Prisma.TaskUpdateInput;
}

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(
    @Query('projectId') projectId?: string,
    @Headers('x-user-id') userId?: string,
  ) {
    return this.tasksService.findAll(projectId, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  create(@Body() body: any, @Headers('x-user-id') userId?: string) {
    const data = normalizeTaskPayload(body, false);
    if (userId && !data.reporter) {
      data.reporter = { connect: { id: userId } };
    }
    return this.tasksService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    const data = normalizeTaskPayload(body, true);
    return this.tasksService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
