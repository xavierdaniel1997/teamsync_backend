export interface IOtp {
    id?: string;
    email: string;
    otp: string;
    expiresAt: Date;
}
