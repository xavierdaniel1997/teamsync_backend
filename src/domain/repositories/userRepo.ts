import { IUser } from "../entities/user";

export interface  IUserRepository{
    findByEmail(email: string): Promise<IUser | null>
    createUser(user: IUser): Promise<IUser>
    updateUser(email: string, data: Partial<IUser>): Promise<IUser | null>;
    findUserById(userId: string): Promise<IUser | null>
}