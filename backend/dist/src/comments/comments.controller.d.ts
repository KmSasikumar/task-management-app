import { CommentsService } from './comments.service';
import { Prisma } from '@prisma/client';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(data: Prisma.CommentCreateInput): Promise<{
        user: {
            id: string;
            email: string;
            password: string | null;
            name: string;
            avatar: string | null;
            title: string | null;
            username: string | null;
            initials: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string;
        taskId: string;
        userId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        taskId: string;
        userId: string;
    }>;
}
