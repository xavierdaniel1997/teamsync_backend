import { IAdminUserManagmentRepo } from "../../../domain/repositories/adminUserManagmentRepo";

export class UserManagmentUseCase {
    constructor(
        private adminUserManagmentRepo: IAdminUserManagmentRepo
    ) { }

    async execute(): Promise<any[] | null> {
        const users = await this.adminUserManagmentRepo.getAllUsersWithDetails();
        return users;
    }
}