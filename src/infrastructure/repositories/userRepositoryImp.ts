import e from "express"
import { IUser } from "../../domain/entities/user"
import { IUserRepository } from "../../domain/repositories/userRepo"
import UserModel from "../database/userModel"
import mongoose from "mongoose"


export class userRepositoryImp implements IUserRepository{
    async findByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({email})
    }

    async createUser(user: IUser): Promise<IUser> {
        const newUser = new UserModel(user)
        return await newUser.save()
    }

    async updateUser(email: string, data: Partial<IUser>): Promise<IUser | null> {
        return await UserModel.findOneAndUpdate({ email }, data, { new: true }).select('-password');
    }

    async findUserById(userId: string): Promise<IUser | null> {
        return await UserModel.findById(userId).select("-password")
    }
}