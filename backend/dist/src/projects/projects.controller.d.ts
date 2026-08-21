import { ProjectsService } from './projects.service';
import { Prisma } from '@prisma/client';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    findAll(): Promise<({
        lead: {
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
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        dueDate: Date | null;
        leadId: string;
    })[]>;
    findOne(id: string): Promise<{
        lead: {
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
        tasks: ({
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
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        dueDate: Date | null;
        leadId: string;
    }>;
    create(data: Prisma.ProjectCreateInput): Promise<{
        lead: {
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
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        dueDate: Date | null;
        leadId: string;
    }>;
    update(id: string, data: Prisma.ProjectUpdateInput): Promise<{
        lead: {
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
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        dueDate: Date | null;
        leadId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        priority: string;
        dueDate: Date | null;
        leadId: string;
    }>;
}
