import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Prisma } from '@prisma/client';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() data: Prisma.CommentCreateInput) {
    return this.commentsService.create(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }
}
