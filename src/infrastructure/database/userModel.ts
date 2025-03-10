import mongoose, {Schema} from "mongoose";
import { IUser } from "../../domain/entities/user";

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    fullName: { type: String },
    password: { type: String },
    avatar: { type: String },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
})

const UserModel = mongoose.model("User", userSchema)
export default UserModel;