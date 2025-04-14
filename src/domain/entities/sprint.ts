export enum SprintStatus {
    PLANNED = "PLANNED",
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
  }
  
  export interface ISprint {
    id?: string;
    project: string;
    workspace: string;
    name: string;
    goal?: string;
    startDate?: Date;
    endDate?: Date;
    status: SprintStatus;
    tasks: string[];
    createdAt: Date;
  }