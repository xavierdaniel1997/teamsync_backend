import { IProject, ProjectAccessLevel } from "../entities/project";

export interface IProjectRepo{
    create(project: Partial<IProject>): Promise<IProject>;
    findById(projectId: string): Promise<IProject | null>;
    addMember(projectId: string, userId: string, accessLevel: ProjectAccessLevel): Promise<IProject | null>;
}