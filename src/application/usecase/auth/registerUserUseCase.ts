import { IOtpRepository } from "../../../domain/repositories/OTPRepo";
import { IUserRepository } from "../../../domain/repositories/userRepo";
import bcrypt from 'bcryptjs'

export class RegisterUserUseCase{
    constructor(
        private userRepo: IUserRepository,
        // privete otpRepo: IOtpRepository,
    ){}

    async execute(email: string, fullName: string,  password: string, cpassword: string, avatar?: string): Promise<void>{
        console.log("📌 Received Password:", password);
    console.log("📌 Received Confirm Password:", cpassword);

        const user = await this.userRepo.findByEmail(email)
        if(!user || !user.isVerified){
            throw new Error("User is not verified OTP verification required")
        }
        if(password !== cpassword){
            throw new Error("Different password")
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const completeRegister = await this.userRepo.updateUser(email, {
            fullName,
            password: hashedPassword,
            avatar,
            createdAt: new Date(),
        })
    }

}