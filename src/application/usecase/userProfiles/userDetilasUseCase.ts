import { IUser } from "../../../domain/entities/user";
import { IUserRepository } from "../../../domain/repositories/userRepo";

export class userDetialUseCase{
    constructor(
        private userRepo: IUserRepository,
    ){}

    async execute(userId: string): Promise<IUser>{
        const userDetails = await this.userRepo.findUserById(userId)
        if (!userDetails) {
            throw new Error("User not found");
        }

        // console.log("userDetilas", userDetails)

        return userDetails
    }
}