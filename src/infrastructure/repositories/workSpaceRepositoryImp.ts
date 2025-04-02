import { Types } from "mongoose";
import { IWorkspace } from "../../domain/entities/workSpace";
import { IWorkSpaceRepo } from "../../domain/repositories/workSpaceRepo";
import WorkSpaceModel from "../database/workSpaceModel";


export class WorkSpaceRepositoryImp implements IWorkSpaceRepo {
    async createSpace(workSpace: IWorkspace): Promise<IWorkspace> {
        const newWorkSpace = new WorkSpaceModel(workSpace)
        return await newWorkSpace.save()
    }

    async findWorkSpaceByOwner(ownerId: string): Promise<IWorkspace | null> {
        // const result = await WorkSpaceModel.findOne({owner: new Types.ObjectId(ownerId)})
        const result = await WorkSpaceModel.findOne({ owner: ownerId })
        return result;
    }

    async updateWorkSpace(id: string, workspace: Partial<IWorkspace>): Promise<IWorkspace> {
        const updated = await WorkSpaceModel.findByIdAndUpdate(id, workspace, { new: true })
        if (!updated) throw new Error("Workspace not found");
        return updated;
    }

    async updateWorkspaceSubscription(workspaceId: string, subscriptionId: string): Promise<IWorkspace> {
        const updatedWorkspace = await WorkSpaceModel.findByIdAndUpdate(workspaceId,
            { subscription: new Types.ObjectId(subscriptionId) },
            { new: true }
        );
        console.log("from the updateworkspce subscription", updatedWorkspace)
        if (!updatedWorkspace) throw new Error("Workspace not found");
        return updatedWorkspace;
    }

    async updateWorkspaceProjects(workspaceId: string, projectId: string): Promise<IWorkspace> {
        const updatedWorkspace = await WorkSpaceModel.findByIdAndUpdate(workspaceId,
            { $push: { projects: projectId } },
            { new: true }
        )
        if (!updatedWorkspace) throw new Error("Workspace not found and not able to add project")
        return updatedWorkspace
    }

    async updateWorkspaceMembers(workspaceId: string, userId: string): Promise<IWorkspace> {
        console.log("calling the function", workspaceId, userId)
        const result = await WorkSpaceModel.findByIdAndUpdate(
            workspaceId,
            { $push: { members: userId } },
            { new: true }
        );
        if (!result) throw new Error("Workspace not found");
        console.log("updateworkspacemembers", result)
        return result
    }
}