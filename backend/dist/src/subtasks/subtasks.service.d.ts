import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class SubtasksService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.SubtaskCreateInput): Promise<{
        id: string;
        title: string;
        priority: string;
        dueDate: Date | null;
        status: string;
        taskId: string;
    }>;
    update(id: string, data: Prisma.SubtaskUpdateInput): Promise<{
        id: string;
        title: string;
        priority: string;
        dueDate: Date | null;
        status: string;
        taskId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        title: string;
        priority: string;
        dueDate: Date | null;
        status: string;
        taskId: string;
    }>;
}
