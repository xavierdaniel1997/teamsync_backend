export interface CreateSprintDTO {
    userId?: string;
    projectId: string;
    sprintName?: string;
    workspaceId: string;
    goal?: string;
    startDate?: Date;
    endDate?: Date;
  }