import { IOtpRepository } from "../../../domain/repositories/OTPRepo";
import { IUserRepository } from "../../../domain/repositories/userRepo";
import otpGenerator from 'otp-generator';
import { EmailType, sendEmail } from "../../../interfaces/utils/emailService";
import bcrypt from 'bcryptjs'
import crypto from "crypto";

export class ForgotPasswordUseCase {
    constructor(
        private userRepo: IUserRepository,
        private otpRepo: IOtpRepository,
    ) { }

    // async forgotPswOtp(email: string): Promise<void> {
    //     const existingUser = await this.userRepo.findByEmail(email)
    //     if (!existingUser) throw new Error("User not found with this email")

    //     const otpCode: string = otpGenerator.generate(6, {
    //         digits: true,
    //         upperCaseAlphabets: false,
    //         lowerCaseAlphabets: false,
    //         specialChars: false,
    //     });
    //     console.log("otp", otpCode)

    //     const expiresAt = new Date(Date.now() + 1 * 60 * 1000)
    //     await this.otpRepo.saveOTP({ email, otp: otpCode, expiresAt })
    //     await sendEmail(email, EmailType.OTP, { otp: otpCode })
    // }


    // async resetPasswrod(email: string, newPassword: string, cpassword: string): Promise<void> {
    //     const existingUser = await this.userRepo.findByEmail(email)
    //     if (!existingUser) throw new Error("User not found with this email")
    //     if (newPassword !== cpassword) throw new Error("Passwords do not match");
    //     const hashedPassword = await bcrypt.hash(newPassword, 10);
    //     await this.userRepo.updateUser(email, { password: hashedPassword });
    // }

    async forgotPassword(email: string): Promise<void>{
        const existingUser = await this.userRepo.findByEmail(email)
        if(!existingUser) throw new Error("User not found with this email");

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetExpires = new Date(Date.now() + 5 * 60 * 1000);

        await this.userRepo.updateUser(email, {
            resetPasswordToken: resetToken,
            resetPasswordExpires: resetExpires,
        });

        const resetLink = `http://localhost:5000/reset-password/${resetToken}`;

        await sendEmail(email, EmailType.FORGOTPASSWORD, { resetLink });
    }

    async resetPswEmail(email: string, token: string, newPassword: string, cpassword: string): Promise<void>{
        const existingUser = await this.userRepo.findByEmail(email);
        if (!existingUser) throw new Error("User not found");

        if (!existingUser.resetPasswordToken || existingUser.resetPasswordToken !== token) {
            throw new Error("Invalid or expired token");
        }
        if (!existingUser.resetPasswordExpires || existingUser.resetPasswordExpires < new Date()) {
            throw new Error("Reset token has expired");
        }
        if (newPassword !== cpassword) throw new Error("Passwords do not match");

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.userRepo.updateUser(email, {
            password: hashedPassword,
            resetPasswordToken: undefined,
            resetPasswordExpires: undefined,
        });
    }
}