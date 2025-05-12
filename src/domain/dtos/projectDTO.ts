import { ProjectAccessLevel } from "../entities/project";

export interface ProjectDTO {
    name?: string;
    projectId: string;
    projectkey?: string;
    title?: string;
    description?: string;
    projectCoverImg?: string;
    workspaceId?: string;
    userId: string;
    emails?: string[];
    accessLevel?: ProjectAccessLevel;
    memberId?: string;
    newAccessLevel?: string;
}


