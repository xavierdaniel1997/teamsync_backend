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
        const result = await WorkSpaceModel.findOne({owner: new Types.ObjectId(ownerId)})
        return result;
    }
}