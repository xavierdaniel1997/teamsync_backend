import axios from "axios";
import { IUserRepository } from "../../../domain/repositories/userRepo";
import { OAuth2Client } from "google-auth-library";
import { generateAccessToken, generateRefreshToken } from "../../../interfaces/utils/jwtUtils";
import { IUser, UserRole } from "../../../domain/entities/user";


const client = new OAuth2Client();

export class GoogleLoginUseCase {
    constructor(
        private userRepo: IUserRepository,
    ) { }


    async execute(access_token: string): Promise<{user: IUser; accessToken: string; refreshToken: string}> {
        const ticket = await client.getTokenInfo(access_token);
        const {data: userInfo} = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );
        const email = userInfo.email;
        const fullName = userInfo.name;
        const avatar = userInfo.picture;
    
        let user = await this.userRepo.findByEmail(email);

        if (!user) {
          const newUser: IUser = {
            email,
            fullName,
            role: UserRole.VIEWER, 
            isVerified: true,
            avatar,
            isRegComplet: true,
            createdAt: new Date(),
          };
    
          user = await this.userRepo.createUser(newUser);
        }

        if (!user._id || !user.role || !user.fullName) {
          throw new Error("Missing user data");
        }
    
        const accessToken = generateAccessToken(user._id, user.role, user.fullName);
        const refreshToken = generateRefreshToken(user._id, user.role, user.fullName);
    
        return { user, accessToken, refreshToken };
    }
}

