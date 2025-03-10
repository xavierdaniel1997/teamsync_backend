import mongoose, { Schema } from "mongoose";
import { IOtp } from "../../domain/entities/OTP";


const OtpSchema = new Schema<IOtp>({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, expires: 60 }
});

const OTPModel = mongoose.model<IOtp>("Otp", OtpSchema);
export default OTPModel;
