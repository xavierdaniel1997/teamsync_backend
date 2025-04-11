import { IProject, ProjectAccessLevel } from "../../domain/entities/project";
import { IProjectRepo } from "../../domain/repositories/projectRepo";
import ProjectModel from "../database/projectModel";

export class ProjectRepoImpl implements IProjectRepo {
    async create(project: Partial<IProject>): Promise<IProject> {
        return await ProjectModel.create(project)
    }

    async findById(projectId: string): Promise<IProject | null> {
        return await ProjectModel.findById(projectId)
            .populate("workspace")
            .populate("owner")
            .populate("members.user");
    }

    async addMember(projectId: string, userId: string, accessLevel: ProjectAccessLevel): Promise<IProject | null> {
        return await ProjectModel.findByIdAndUpdate(
            projectId,
            { $push: { members: { user: userId, accessLevel } } },
            { new: true }
        ).populate("members.user");
    }

    async findByWorkspace(workspaceId: string): Promise<IProject[]> {
        const result = await ProjectModel.find({ workspace: workspaceId })
            .populate("owner", "fullName email")
            .populate("members.user", "fullName email")
            .populate("workspace", "name");
        return result;
    }
}