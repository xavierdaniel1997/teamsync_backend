

import mongoose, { Schema, Document } from "mongoose";
import { IUser, UserRole } from "../../domain/entities/user"; 

const userSchema = new Schema<IUser & Document>({
    email: { type: String, required: true, unique: true },
    fullName: { type: String },
    secondName: {type: String},
    password: { type: String },
    role: { 
        type: String, 
        enum: Object.values(UserRole),
        required: true,
        default: UserRole.VIEWER
    },
    avatar: { type: String },
    coverPhoto: {type: String},
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },                      
    isRegComplet: {type: Boolean, default: false},

    resetPasswordToken: { type: String, default: null },  
    resetPasswordExpires: { type: Date, default: null }   
});

const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;

