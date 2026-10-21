import {
  BadRequestException,
  Controller,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Prisma } from '@prisma/client';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() data: Prisma.CommentCreateInput & { content?: unknown }) {
    // Empty/whitespace comments were stored verbatim before validation.
    if (typeof data?.content !== 'string' || data.content.trim() === '') {
      throw new BadRequestException('Comment content is required');
    }
    data.content = data.content.trim();
    return this.commentsService.create(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }
}
