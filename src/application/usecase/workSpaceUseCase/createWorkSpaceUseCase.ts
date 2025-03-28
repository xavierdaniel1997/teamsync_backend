import { IWorkspace, WorkSpacePlan } from "../../../domain/entities/workSpace";
import { IWorkSpaceRepo } from "../../../domain/repositories/workSpaceRepo";
import { Types } from "mongoose";

export class CreateWorkSpaceUseCase{
    constructor(
        private workSpaceResp : IWorkSpaceRepo
    ){}

    async execute(name: string, ownerId: string): Promise<IWorkspace>{

        const existingWorkspace = await this.workSpaceResp.findWorkSpaceByOwner(ownerId)
        if (existingWorkspace) {
            throw new Error("User already owns a workspace. Only one workspace per user is allowed.");
        }
        const workspaceData: IWorkspace = {
            name,
            owner: new Types.ObjectId(ownerId),
            members: [new Types.ObjectId(ownerId)], 
            projects: [],
            teams: [],
            plan: WorkSpacePlan.FREE,
            subscription: null,
            createdAt: new Date()
        };
        const createWorkSpace = await this.workSpaceResp.createSpace(workspaceData)
        return createWorkSpace;
    }
}