import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    signup(body: any): Promise<{
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
    login(body: any): Promise<{
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
