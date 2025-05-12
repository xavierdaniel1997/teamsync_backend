import { ITask, TaskType } from "../../domain/entities/task";
import { ITaskRepository } from "../../domain/repositories/taskRepository";
import TaskModel from "../database/taskModel";


export class ITaskRepositoryImp implements ITaskRepository {
    async create(task: Partial<ITask>): Promise<ITask> {
        const createTask = await TaskModel.create(task);
        return createTask;
    }

    async findById(id: string): Promise<ITask | null> {
        const task = await TaskModel.findById(id);
        return task as ITask | null;
    }

    async findBykey(key: string): Promise<ITask | null> {
        const task = await TaskModel.findOne({ key });
        return task as ITask | null;
    }

    async findEpicsByProject(projectId: string): Promise<ITask[]> {
        // console.log("projectId from tasImp", projectId)
        return TaskModel.find({
          project: projectId,
          type: "EPIC",
        })
      }

    async findBacklogTasks(projectId: string): Promise<ITask[]> {
        return TaskModel.find({
            project: projectId,
            sprint: { $exists: false },
            type: { $nin: [TaskType.EPIC, TaskType.SUBTASK] },
        })
        .populate({ path: "epic", select: "title taskKey" })
        .populate("assignee").select("-password")
        .populate("reporter").select("-password")
        .populate({path: "epic", select: "title taskKey", })
        .exec();
    }
}