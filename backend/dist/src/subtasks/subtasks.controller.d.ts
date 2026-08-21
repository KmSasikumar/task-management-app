import { SubtasksService } from './subtasks.service';
import { Prisma } from '@prisma/client';
export declare class SubtasksController {
    private readonly subtasksService;
    constructor(subtasksService: SubtasksService);
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
