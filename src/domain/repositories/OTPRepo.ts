import { IOtp } from "../entities/OTP";

export interface IOtpRepository{
    saveOTP(otp: IOtp): Promise<void>
    findOTP(email: string, otp: string): Promise<IOtp | null>
    deleteOTP(email: string): Promise<void>
}