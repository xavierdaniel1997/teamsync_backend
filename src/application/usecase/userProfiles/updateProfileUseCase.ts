import { IUser } from "../../../domain/entities/user";
import { IUserRepository } from "../../../domain/repositories/userRepo";

interface UpdataProfileDTO {
    userId: string;
    email: string;
    fullName: string;
    avatar?: string;
  }

export class UpdateProfileUseCase{
    constructor(
        private userRepo: IUserRepository
    ) {}

    async execute(userData: UpdataProfileDTO):Promise<{userDetial: any}> {
        const {userId, email, fullName, avatar } = userData;
        const user = await this.userRepo.findUserById(userId)
        if (!user) {
            throw new Error("User not found");
        }

        const updatedUser = await this.userRepo.updateUser(user.email, {
            email,
            fullName,
            avatar
        });
        console.log("user detials from the update user", updatedUser)
        return { userDetial: updatedUser };
    }
}