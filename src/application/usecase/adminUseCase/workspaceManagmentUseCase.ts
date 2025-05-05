import { IWorkspace } from "../../../domain/entities/workSpace";
import { IWorkSpaceRepo } from "../../../domain/repositories/workSpaceRepo";

export class WorkspaceManagmentUseCase{
    constructor(
        private workspaceRepo: IWorkSpaceRepo,
    ){}

    async execute ():Promise<IWorkspace[]> {
        const workSpace = await this.workspaceRepo.findAllWorkspaces()
        return workSpace;
    }
}