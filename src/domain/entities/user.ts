// export type UserRole = "project_manager" | "developer" | "tester"

// export interface IUser {
//     id?: string;
//     email: string;
//     fullName?: string; 
//     password?: string; 
//     role?: UserRole;  
//     avatar?: string;
//     isVerified: boolean;
//     createdAt: Date;
// }



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
}