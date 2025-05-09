import { ITask } from "../entities/task";

export interface ITaskRepository{
    create(task: Partial<ITask>):Promise <ITask>;
    findById(id: string): Promise<ITask | null>
    findBykey(key: string): Promise<ITask | null>
    findEpicsByProject(projectId: string): Promise<ITask[]>;
    findBacklogTasks(projectId: string): Promise<ITask[]>;
}