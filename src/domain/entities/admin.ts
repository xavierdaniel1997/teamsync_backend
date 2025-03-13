export enum AdminRole {
  SUPERADMIN = "superAdmin",
  ADMIN = "admin"
}

export interface IAdmin{
    fullName: string;
    email: string;
    password: string;
    role: AdminRole; 
    avatar?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
  }