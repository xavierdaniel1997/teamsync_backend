import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";

const getAllWorkspaces = async (req: Request, res: Response) => {
    try{
        sendResponse(res, 200, null, "Successfully fetch workspaces")
    }catch(error: any){
        sendResponse(res, 400, null, error.message || "Failed to fetch all workspace")
    }
}

export {getAllWorkspaces}