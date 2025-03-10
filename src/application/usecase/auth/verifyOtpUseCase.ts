import { IOtpRepository } from "../../../domain/repositories/OTPRepo";
import { IUserRepository } from "../../../domain/repositories/userRepo";

export class VerifyOtpUseCase{
    constructor(
        private userRepo: IUserRepository,
        private otpRepo: IOtpRepository
    ) {}

    async execute(email: string, otp: string): Promise<boolean> {
        const otpCode = await this.otpRepo.findOTP(email, otp)
        if (!otpCode) throw new Error("Invalid OTP");
        
        const currentTime = new Date();
        if (otpCode.expiresAt < currentTime) {
            throw new Error("OTP has expired");
        }

        await this.userRepo.createUser({email, isVerified: true, createdAt: new Date()})
        await this.otpRepo.deleteOTP(email)

        return true;
    }
} 