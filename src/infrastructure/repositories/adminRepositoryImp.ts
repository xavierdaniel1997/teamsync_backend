import { IAdmin } from "../../domain/entities/admin";
import { IAdminRepository } from "../../domain/repositories/adminRepo";
import AdminModel from "../database/adminModel";


export class AdminRepositoryImp implements IAdminRepository {
    async findByEmail(email: string): Promise<IAdmin | null> {
        return await AdminModel.findOne({ email })
    }

    async createAdmin(admin: IAdmin): Promise<IAdmin> {
        const newAdmin = new AdminModel(admin)
        return await newAdmin.save()
    }

    async updateAdmin(email: string, data: Partial<IAdmin>): Promise<IAdmin | null> {
        return await AdminModel.findOneAndUpdate({ email }, data, { new: true });
    }

    async findAdminById(userId: string): Promise<IAdmin | null> {
        return await AdminModel.findById(userId)
    }
}