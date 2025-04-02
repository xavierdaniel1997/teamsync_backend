import { IWorkspace } from "../entities/workSpace";

export interface IWorkSpaceRepo{
    createSpace(workSpace: IWorkspace): Promise<IWorkspace>
    findWorkSpaceByOwner(ownerId: string): Promise<IWorkspace | null>
    updateWorkSpace(id: string, workspace:Partial<IWorkspace>): Promise<IWorkspace>;
    updateWorkspaceSubscription(workspaceId: string, subscriptionId: string): Promise<IWorkspace>;
    updateWorkspaceProjects(workspaceId: string, projectId: string): Promise<IWorkspace>
    updateWorkspaceMembers(workspaceId: string, userId: string): Promise<IWorkspace>;
}