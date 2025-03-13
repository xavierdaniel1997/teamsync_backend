import { IUserRepository } from "../../../domain/repositories/userRepo";
import bcrypt from 'bcryptjs'
import { generateAccessToken, generateRefreshToken } from "../../../interfaces/utils/jwtUtils";
import { IUser } from "../../../domain/entities/user";

interface UserLoginDTO {
    email: string;
    password: string;
}


export class LoginUserUseCase {
    constructor(
        private userRepo: IUserRepository,
    ) {}


    async execute(loginData: UserLoginDTO): Promise<{ userData: IUser; accessToken: string; refreshToken: string }> {
        const { email, password } = loginData;

        const userData = await this.userRepo.findByEmail(email)
        if (!userData) {
            throw new Error("User not found");
        }

        if (!userData.isVerified) {   
            throw new Error("User is not verified. Please complete OTP verification.");
        }

        if (!userData.isRegComplet) {
            throw new Error("User registration is incomplete");
        }
  
        const isMatchPass = await bcrypt.compare(password, userData.password!);
        if (!isMatchPass) {
            throw new Error("Invalid credentials");
        }

        if (!userData._id || !userData.role || !userData.fullName) {
            throw new Error("User detail missing required fields");
        }

        const accessToken = generateAccessToken(
            userData._id,
            userData.role,
            userData.fullName
        )

        const refreshToken = generateRefreshToken(
            userData._id,
            userData.role,
            userData.fullName
        )

        return {userData, accessToken, refreshToken}
    }
}