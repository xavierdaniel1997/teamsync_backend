import mongoose, { Schema, Document } from "mongoose";
import { AdminRole, IAdmin } from "../../domain/entities/admin";


const AdminSchema = new Schema<IAdmin>(
  {
    fullName: { type: String, required: true }, 
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true }, 
    // role: { type: String, default: "superadmin" },
    role: { 
            type: String, 
            enum: Object.values(AdminRole),
            required: true,
            default: AdminRole.ADMIN
        },
    avatar: { type: String },
    resetPasswordToken: { type: String, default: null },  
    resetPasswordExpires: { type: Date, default: null }
  },
  { timestamps: true } 
);

const AdminModel = mongoose.model<IAdmin>("Admin", AdminSchema);
export default AdminModel;
