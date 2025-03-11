import { IOtp } from "../../../domain/entities/OTP";
import { IOtpRepository } from "../../../domain/repositories/OTPRepo";
import { IUser } from "../../../domain/entities/user";
import { IUserRepository } from "../../../domain/repositories/userRepo";
import otpGenerator from 'otp-generator';
import bcrptjs from 'bcryptjs';
import { EmailType, sendEmail } from "../../../interfaces/utils/emailService";

export class SendOTPUseCase{
    constructor(
        private userRepo: IUserRepository,
        private otpRepo: IOtpRepository,
    ) {}

    async execute(email: string): Promise<void> {
        const existingUser = await this.userRepo.findByEmail(email)
        if(existingUser) throw new Error("User already exists");

        const otpCode: string = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("otp", otpCode)

        const expiresAt = new Date(Date.now() + 1 * 60 * 1000)
        await this.otpRepo.saveOTP({email, otp: otpCode, expiresAt})
        await sendEmail(email, EmailType.OTP, {otp: otpCode})
    }
}