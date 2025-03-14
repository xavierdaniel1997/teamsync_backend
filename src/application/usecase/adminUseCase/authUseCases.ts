import { AdminRole, IAdmin } from "../../../domain/entities/admin";
import { IAdminRepository } from "../../../domain/repositories/adminRepo";
import bcrypt from 'bcryptjs'
import { generateAccessToken, generateRefreshToken } from "../../../interfaces/utils/jwtUtils";

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

    async loginAdmin(email: string, password: string): Promise<{ admin: IAdmin, accessToken: string, refreshToken: string }> {
        const admin = await this.adminRepo.findByEmail(email)
        if (!admin) throw new Error("Admin not exist")
        const isMatchPass = await bcrypt.compare(password, admin.password!);
        if (!isMatchPass) {
            throw new Error("Invalid credentials");
        }
        console.log("Admin detials", admin)
        if (!admin._id || !admin.role || !admin.fullName) {
            throw new Error("User detail missing required fields");
        }
        const accessToken = generateAccessToken(
            admin._id,
            admin.role,
            admin.fullName
        )

        const refreshToken = generateRefreshToken(
            admin._id,
            admin.role,
            admin.fullName
        )

        return { admin, accessToken, refreshToken }
    }
}