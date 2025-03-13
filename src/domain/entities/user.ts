
export enum UserRole {
    PROJECT_MANAGER = "project_manager",
    DEVELOPER = "developer",
    TESTER = "tester",
    VIEWER = "viewer"
}

export interface IUser {
    _id?: string;
    email: string;
    fullName?: string;
    password?: string;
    role: UserRole; 
    avatar?: string;
    isVerified: boolean;
    createdAt: Date; 
    isRegComplet?: boolean;  
    
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
}