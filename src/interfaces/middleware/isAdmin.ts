import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwtUtils";
import { sendResponse } from "../utils/sendResponse";
import AdminModel from "../../infrastructure/database/adminModel";
import { AdminRole } from "../../domain/entities/admin";

export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      sendResponse(res, 401, null, "Unauthorized: Token missing");
      return;
    }

    const decoded = verifyAccessToken(token);

    if (
      !decoded ||
      typeof decoded === "string" ||
      (decoded.role !== AdminRole.ADMIN && decoded.role !== AdminRole.SUPERADMIN)
    ) {
      sendResponse(res, 403, null, "Forbidden: Admin access required");
      return;
    }

    const admin = await AdminModel.findById(decoded.userId);
    if (!admin) {
      sendResponse(res, 404, null, "Admin not found");
      return;
    }

    (req as any).user = decoded;

    next();
  } catch (error) {
    console.error("isAdmin middleware error:", error);
    sendResponse(res, 401, null, "Invalid or expired token");
  }
};
