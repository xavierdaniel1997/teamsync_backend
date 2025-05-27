export interface CreateSprintDTO {
  userId?: string;
  projectId: string;
  sprintName?: string;
  workspaceId: string;
  duration?: string;
  goal?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface UpdateSprintDTO {
  workspaceId: string;
  projectId: string;
  sprintId: string;
  sprintName?: string;
  duration?: string;
  sprintGoal?: string;
  startDate?: Date;
  endDate?: Date;
}