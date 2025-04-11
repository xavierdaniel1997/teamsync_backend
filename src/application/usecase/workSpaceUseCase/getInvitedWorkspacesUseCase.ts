import { IWorkspace } from "../../../domain/entities/workSpace";
import { IUserRepository } from "../../../domain/repositories/userRepo";
import { IWorkSpaceRepo } from "../../../domain/repositories/workSpaceRepo";

export class GetInvitedWorkspacesUseCase{
    constructor(
        private workspaceRepo : IWorkSpaceRepo,
        private userRepo: IUserRepository
    ){}

    async execute(userId: string): Promise<IWorkspace[]> {

        const user = await this.userRepo.findUserById(userId)
        if(!user){
            throw new Error("User not found");
        }

        const workspace = await this.workspaceRepo.findWorkspacesByMember(userId)
        if(!workspace){
            throw new Error("No workspace is found as a member")
        }
        return workspace || []

    }
}