
import { IAdmin } from "../entities/admin";


export interface IAdminRepository{
    findByEmail(email: string): Promise<IAdmin | null>
    createAdmin(admin: IAdmin): Promise<IAdmin>
    updateAdmin(email: string, data: Partial<IAdmin>): Promise<IAdmin | null>;
    findAdminById(userId: string): Promise<IAdmin | null>

}