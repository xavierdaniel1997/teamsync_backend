import { AdminRole, IAdmin } from "../../../domain/entities/admin";
import { IAdminRepository } from "../../../domain/repositories/adminRepo";
import bcrypt from 'bcryptjs'

interface AdminRegisterDTO {
    email: string;
    fullName: string;
    password: string;
    cpassword: string;
    role: AdminRole;
    avatar?: string;
}

export class AuthUseCase {
    constructor(
        private adminRepo: IAdminRepository,
    ) { }

    async registerAdmin(adminData: AdminRegisterDTO): Promise<void> {
        const { email, fullName, password, cpassword, role, avatar } = adminData
        const admin = await this.adminRepo.findByEmail(email)
        if (admin) throw new Error("Admin is already exist")
        if (password !== cpassword) {
            throw new Error("Different password")
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const newAdmin: IAdmin = {
            email,
            fullName: fullName as string,
            password: hashedPassword,
            role: AdminRole.ADMIN,
            avatar: avatar || '',
        }

        const adminDetial = await this.adminRepo.createAdmin(newAdmin)
    }
}