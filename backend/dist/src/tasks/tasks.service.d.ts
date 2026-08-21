import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class TasksService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(projectId?: string): Promise<({
        comments: ({
            user: {
                id: string;
                email: string;
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
        })[];
        members: {
            id: string;
            email: string;
            name: string;
            avatar: string | null;
            title: string | null;
            username: string | null;
            initials: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        reporter: {
            id: string;
            email: string;
            name: string;
            avatar: string | null;
            title: string | null;
            username: string | null;
            initials: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        subtasks: {
            id: string;
            title: string;
            priority: string;
            dueDate: Date | null;
            status: string;
            taskId: string;
        }[];
    } & {
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        dueDate: Date | null;
        description: string | null;
        status: string;
        labels: string | null;
        reporterId: string | null;
        projectId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        comments: ({
            user: {
                id: string;
                email: string;
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
        })[];
        members: {
            id: string;
            email: string;
            name: string;
            avatar: string | null;
            title: string | null;
            username: string | null;
            initials: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        reporter: {
            id: string;
            email: string;
            name: string;
            avatar: string | null;
            title: string | null;
            username: string | null;
            initials: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        subtasks: {
            id: string;
            title: string;
            priority: string;
            dueDate: Date | null;
            status: string;
            taskId: string;
        }[];
    } & {
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        dueDate: Date | null;
        description: string | null;
        status: string;
        labels: string | null;
        reporterId: string | null;
        projectId: string | null;
    }>;
    create(data: Prisma.TaskCreateInput): Promise<{
        comments: {
            id: string;
            createdAt: Date;
            content: string;
            taskId: string;
            userId: string;
        }[];
        members: {
            id: string;
            email: string;
            name: string;
            avatar: string | null;
            title: string | null;
            username: string | null;
            initials: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        reporter: {
            id: string;
            email: string;
            name: string;
            avatar: string | null;
            title: string | null;
            username: string | null;
            initials: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        subtasks: {
            id: string;
            title: string;
            priority: string;
            dueDate: Date | null;
            status: string;
            taskId: string;
        }[];
    } & {
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        dueDate: Date | null;
        description: string | null;
        status: string;
        labels: string | null;
        reporterId: string | null;
        projectId: string | null;
    }>;
    update(id: string, data: Prisma.TaskUpdateInput): Promise<{
        comments: {
            id: string;
            createdAt: Date;
            content: string;
            taskId: string;
            userId: string;
        }[];
        members: {
            id: string;
            email: string;
            name: string;
            avatar: string | null;
            title: string | null;
            username: string | null;
            initials: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        reporter: {
            id: string;
            email: string;
            name: string;
            avatar: string | null;
            title: string | null;
            username: string | null;
            initials: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        subtasks: {
            id: string;
            title: string;
            priority: string;
            dueDate: Date | null;
            status: string;
            taskId: string;
        }[];
    } & {
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        dueDate: Date | null;
        description: string | null;
        status: string;
        labels: string | null;
        reporterId: string | null;
        projectId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        dueDate: Date | null;
        description: string | null;
        status: string;
        labels: string | null;
        reporterId: string | null;
        projectId: string | null;
    }>;
}
