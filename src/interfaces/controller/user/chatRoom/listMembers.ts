import { Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { ProjectRepoImpl } from "../../../../infrastructure/repositories/projectRepoImpl";
import { WorkSpaceRepositoryImp } from "../../../../infrastructure/repositories/workSpaceRepositoryImp";
import { ListMembersUseCase } from "../../../../application/usecase/chatRoom/listMembersUseCase";

const projectRepo = new ProjectRepoImpl()
const workSpaceRepo = new WorkSpaceRepositoryImp()
const listMembersUseCase = new ListMembersUseCase(projectRepo, workSpaceRepo)

const listMembersController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const { workspaceId, projectId } = req.params;
        const projectMembers = await listMembersUseCase.execute(workspaceId, projectId, userId)
        const filteredMembers = projectMembers.members.filter(
            (member) => member.user._id.toString() !== userId
        );
        const responseData = {
            _id: projectMembers._id,
            owner: projectMembers.owner,
            members: filteredMembers,
        };
        sendResponse(res, 200, responseData, "successfull list the members")
    } catch (error: any) {
        sendResponse(res, 400, null, error.message || "failed to list the members")
    }
}

export { listMembersController };