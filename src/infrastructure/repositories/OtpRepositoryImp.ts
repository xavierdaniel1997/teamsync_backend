import { IOtp } from "../../domain/entities/OTP";
import { IOtpRepository } from "../../domain/repositories/OTPRepo";
import OTPModel from "../database/OTPModel";

export class OtpRepositoryImp implements IOtpRepository{
    async saveOTP(otp: IOtp): Promise<void> {
        await OTPModel.create(otp);
    }

    async findOTP(email: string, otp: string): Promise<IOtp | null> {
        return await OTPModel.findOne({email, otp})
    }

    async deleteOTP(email: string): Promise<void> {
        await OTPModel.deleteOne({email})
    }
}