import { SprintStatus } from "../entities/sprint";
import { ITask } from "../entities/task";

export interface ITaskRepository{
    create(task: Partial<ITask>):Promise <ITask>;
    findById(id: string): Promise<ITask | null>
    findBykey(key: string): Promise<ITask | null>
    findEpicsByProject(projectId: string): Promise<ITask[]>;
    findBacklogTasks(projectId: string): Promise<ITask[]>;
    update(id: string, taskData: Partial<ITask>): Promise<ITask | null>;
    delete(taskId: string): Promise<void>;
    updateMany(filter: any, update: Partial<ITask>): Promise<void>
    findTasksBySprintStatus(projectId: string, status: SprintStatus): Promise<ITask[]>;
    findTaskByProjects(projectId: string): Promise<ITask[]>
}