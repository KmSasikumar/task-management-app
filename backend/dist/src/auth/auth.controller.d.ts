import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
