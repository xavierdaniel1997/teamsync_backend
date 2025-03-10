export interface IUser {
    id?: string;
    email: string;
    fullName?: string; 
    password?: string;  
    avatar?: string;
    isVerified: boolean;
    createdAt: Date;
}
