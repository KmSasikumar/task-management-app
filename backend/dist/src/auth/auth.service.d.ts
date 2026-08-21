import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    constructor(usersService: UsersService);
    guestLogin(): Promise<{
        id: string;
        email: string;
        name: string;
        avatar: string | null;
        title: string | null;
        username: string | null;
        initials: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
