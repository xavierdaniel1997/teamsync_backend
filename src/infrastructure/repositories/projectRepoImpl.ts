import { Types } from "mongoose";
import { IProject, ProjectAccessLevel } from "../../domain/entities/project";
import { IProjectRepo } from "../../domain/repositories/projectRepo";
import ProjectModel from "../database/projectModel";
import { IUser } from "../../domain/entities/user";

export class ProjectRepoImpl implements IProjectRepo {
    async create(project: Partial<IProject>): Promise<IProject> {
        return await ProjectModel.create(project)
    }

    async findById(projectId: string): Promise<IProject | null> {
        return await ProjectModel.findById(projectId)
            .populate("workspace")
            .populate("owner")
            .populate({
                path: 'members.user',
                select: '-password',
            })
            .populate({
                path: "invitations",
                select: "email status accessLevel createdAt expiresAt token",
            });
    }

    async addMember(projectId: string, userId: string, accessLevel: ProjectAccessLevel): Promise<IProject | null> {
        return await ProjectModel.findByIdAndUpdate(
            projectId,
            { $push: { members: { user: userId, accessLevel } } },
            { new: true }
        ).populate("members.user").select("-password");
    }

    async findByWorkspace(workspaceId: string): Promise<IProject[]> {
        const result = await ProjectModel.find({ workspace: workspaceId })
            .populate("owner", "fullName email")
            .populate("members.user", "fullName email")
            .populate("workspace", "name");
        return result;
    }


    async findUserAccess(projectId: string, userId: string): Promise<IProject | null> {
        return await ProjectModel.findOne({
            _id: projectId,
            $or: [{ owner: userId }, { "members.user": userId }]
        })
    }


    async incrementTaskCounter(projectId: string): Promise<IProject> {
        const project = await ProjectModel.findByIdAndUpdate(
            projectId,
            { $inc: { taskCounter: 1 } },
            { new: true }
        ).exec();
        if (!project) {
            throw new Error("Project not found");
        }
        return project;
    }

    async update(projectId: string, updateData: any): Promise<IProject | null> {
        const updated = await ProjectModel.findByIdAndUpdate(
            projectId,
            updateData,
            { new: true }
        )
            .populate("workspace")
            .populate("owner")
            .populate({
                path: 'members.user',
                select: '-password',
            })
            .populate({
                path: "invitations",
                select: "email status accessLevel createdAt expiresAt token",
            });
        return updated;
    }

    async updateMemberAccessLevel(projectId: string, memberId: string, newAccessLevel: ProjectAccessLevel): Promise<IProject | null> {
        const updateAccessLevel = await ProjectModel.findOneAndUpdate(
            { _id: projectId, "members.user": memberId },
            { $set: { "members.$.accessLevel": newAccessLevel } },
            { new: true }
        )
            .populate("workspace")
            .populate("owner")
            .populate({
                path: "members.user",
                select: "-password",
            })
            .populate({
                path: "invitations",
                select: "email status accessLevel createdAt expiresAt token",
            });
        return updateAccessLevel
    }



    async findMembersByProject(projectId: string): Promise<IProject> {
    const project = await ProjectModel.findById(projectId)
      .select("members owner")
      .populate({
        path: "members.user",
        select: "fullName secondName email avatar role secondName isVerified createdAt isRegComplet",
      })
    //   .populate({
    //     path: "owner",
    //     select: "fullName secondName email avatar role secondName isVerified createdAt isRegComplet",
    //   })
      .exec();
    if (!project) {
      throw new Error("Project not found");
    }

    return project
  }

}