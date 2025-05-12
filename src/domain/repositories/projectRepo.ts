import { IProject, ProjectAccessLevel } from "../entities/project";

export interface IProjectRepo{
    create(project: Partial<IProject>): Promise<IProject>;
    findById(projectId: string): Promise<IProject | null>;
    addMember(projectId: string, userId: string, accessLevel: ProjectAccessLevel): Promise<IProject | null>;
    findByWorkspace(workspaceId: string): Promise<IProject[]>
    findUserAccess(projectId: string, userId: string): Promise<IProject | null>
    incrementTaskCounter(projectId: string): Promise<IProject>;
    update(projectId: string, updateData: any): Promise<IProject | null>
    updateMemberAccessLevel(projectId: string, memberId: string, newAccessLevel: ProjectAccessLevel): Promise<IProject | null>
}