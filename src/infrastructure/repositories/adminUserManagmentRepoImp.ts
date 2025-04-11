import { IAdminUserManagmentRepo } from "../../domain/repositories/adminUserManagmentRepo";
import UserModel from "../database/userModel";

export class AdminUserManagmentRepoImp implements IAdminUserManagmentRepo {
    async getAllUsersWithDetails(): Promise<any[] | null> {
        try {
            const usersWithDetails = await UserModel.aggregate([
                {
                    $lookup: {
                        from: "subscriptions",
                        localField: "_id",
                        foreignField: "user",
                        as: "subscriptions",
                    },
                },
                {
                    $unwind: {
                        path: "$subscriptions",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "plans",
                        localField: "subscriptions.plan",
                        foreignField: "_id",
                        as: "subscriptions.plan",
                    },
                },
                {
                    $unwind: {
                        path: "$subscriptions.plan",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        email: 1,
                        fullName: 1,
                        role: 1,
                        avatar: 1,
                        isVerified: 1,
                        createdAt: 1,
                        isRegComplet: 1,
                        subscription: {
                            status: "$subscriptions.status",
                            stripeSubscriptionId: "$subscriptions.stripeSubscriptionId",
                            stripeCustomerId: "$subscriptions.stripeCustomerId",
                            createdAt: "$subscriptions.createdAt",
                            expiresAt: "$subscriptions.expiresAt",
                            plan: {
                                name: "$subscriptions.plan.name",
                                price: "$subscriptions.plan.price",
                                projectLimit: "$subscriptions.plan.projectLimit",
                                memberLimit: "$subscriptions.plan.memberLimit",
                                isActive: "$subscriptions.plan.isActive",
                                createdAt: "$subscriptions.plan.createdAt",
                            },
                        },
                    },
                },
            ]);

            return usersWithDetails;
        } catch (error) {
            console.error("Error in UserRepositoryImpl:", error);
            throw error;
        }
    }
}