
import { IOtpRepository } from "../../../domain/repositories/OTPRepo";
import { IUserRepository } from "../../../domain/repositories/userRepo";
import bcrypt from 'bcryptjs'
import { IUser, UserRole } from "../../../domain/entities/user";
import { generateAccessToken, generateRefreshToken } from "../../../interfaces/utils/jwtUtils";


interface UserRegisterDTO {
    email: string;
    fullName: string;
    password: string;
    cpassword: string;
    role: UserRole;
    avatar?: string;
  }

export class RegisterUserUseCase{
    constructor(
        private userRepo: IUserRepository,
    ){}

    async execute(userData: UserRegisterDTO): Promise<{user: IUser; accessToken: string; refreshToken: string}>{
        const { email, fullName, password, cpassword, role, avatar } = userData;

        const user = await this.userRepo.findByEmail(email)

        if(user && user.isRegComplet){
            throw new Error("User is already registered");
        }
       
        if(!user || !user.isVerified){
            throw new Error("User is not verified OTP verification required")
        }

        if(password !== cpassword){
            throw new Error("Different password")
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const updateData: Partial<IUser> = {
            fullName,
            password: hashedPassword,
            role,
            avatar,
            createdAt: new Date(),
            isRegComplet: true
        };

        const userDetial = await this.userRepo.updateUser(email, updateData);
        if (!userDetial) throw new Error("User registration failed");

        // console.log("updatedUser", userDetial)

        if (!userDetial._id || !userDetial.role || !userDetial.fullName) {
            throw new Error("User detail missing required fields");
          }

          const accessToken = generateAccessToken(
            userDetial._id.toString(),
            userDetial.role,
            userDetial.fullName
          );

          const refreshToken = generateRefreshToken(
            userDetial._id.toString(),
            userDetial.role,
            userDetial.fullName
          )

        //   console.log("Access Token:", accessToken)
        //   console.log("RefreshToken:", refreshToken)

          return { user, accessToken, refreshToken };
    
    }  

}