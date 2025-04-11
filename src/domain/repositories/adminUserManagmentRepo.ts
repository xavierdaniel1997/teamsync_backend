
export interface IAdminUserManagmentRepo {
  getAllUsersWithDetails(): Promise<any[] | null>;
}