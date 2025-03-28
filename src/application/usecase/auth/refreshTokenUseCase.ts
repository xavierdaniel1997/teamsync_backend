import { IUserRepository } from "../../../domain/repositories/userRepo";
import { generateAccessToken, verifyRefreshToken } from "../../../interfaces/utils/jwtUtils";

export class RefreshTokenUseCase {
    constructor(
        private userRepo: IUserRepository
    ) { }

    async execute(refreshToken: string): Promise<{accessToken: string}> {
        if (!refreshToken) {
            throw new Error("Refresh token is required");
        }

        const decoded: any = verifyRefreshToken(refreshToken)
        console.log("decoded data from the refreshTokenUseCase", decoded)
        console.log("Type of userId:", typeof decoded.userId, decoded.userId);
        const userDetial = await this.userRepo.findUserById(decoded.userId) 
        console.log("this is the data form the userDetials", userDetial)
        if (!userDetial) {
            throw new Error("User not found");
        }
        if (!userDetial._id || !userDetial.role || !userDetial.fullName) {
            throw new Error("User detail missing required fields");
          }
        const newAccessToken = generateAccessToken(
            userDetial._id,
            userDetial.role,
            userDetial.fullName
        );
        return { accessToken: newAccessToken };
    }
}