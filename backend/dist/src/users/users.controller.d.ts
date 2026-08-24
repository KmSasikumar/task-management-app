import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    update(id: string, updateData: any): Promise<{
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
    }>;
}
