import { IWorkspace } from "../../../domain/entities/workSpace";
import { IWorkSpaceRepo } from "../../../domain/repositories/workSpaceRepo";

export class GetWorkSpaceUseCase{
    constructor(
        private workSpaceResp : IWorkSpaceRepo
    ){}

    async execute(userId: string): Promise<IWorkspace>{
        const workSpace = await this.workSpaceResp.findWorkSpaceByOwner(userId);
        if (!workSpace) {
            throw new Error("Workspace not found");
        }
        return workSpace;
    }
}