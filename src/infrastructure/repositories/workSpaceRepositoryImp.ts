import { Types } from "mongoose";
import { IWorkspace } from "../../domain/entities/workSpace";
import { IWorkSpaceRepo } from "../../domain/repositories/workSpaceRepo";
import WorkSpaceModel from "../database/workSpaceModel";


export class WorkSpaceRepositoryImp implements IWorkSpaceRepo{
    async createSpace(workSpace: IWorkspace): Promise<IWorkspace> {
        const newWorkSpace = new WorkSpaceModel(workSpace)
        return await newWorkSpace.save()
    }

    async findWorkSpaceByOwner(ownerId: string): Promise<IWorkspace | null> {
        // const result = await WorkSpaceModel.findOne({owner: new Types.ObjectId(ownerId)})
        const result = await WorkSpaceModel.findOne({owner: ownerId})
        return result;
    }

    async updateWorkSpace(id: string, workspace: Partial<IWorkspace>): Promise<IWorkspace> {
        const updated = await WorkSpaceModel.findByIdAndUpdate(id, workspace, {new: true})
        if (!updated) throw new Error("Workspace not found");
        return updated;
    }
}