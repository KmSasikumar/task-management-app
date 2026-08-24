import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    constructor(usersService: UsersService);
    guestLogin(): Promise<{
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
    signup(email: string, pass: string, name: string): Promise<{
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
    login(email: string, pass: string): Promise<{
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
