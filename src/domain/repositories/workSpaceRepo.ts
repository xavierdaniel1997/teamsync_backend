import { IWorkspace } from "../entities/workSpace";

export interface IWorkSpaceRepo{
    createSpace(workSpace: IWorkspace): Promise<IWorkspace>
    findWorkSpaceByOwner(ownerId: string): Promise<IWorkspace | null>
}