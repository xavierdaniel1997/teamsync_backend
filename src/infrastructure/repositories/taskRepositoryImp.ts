import { SprintStatus } from "../../domain/entities/sprint";
import { ITask, TaskType } from "../../domain/entities/task";
import { ITaskRepository } from "../../domain/repositories/taskRepository";
import SprintModel from "../database/sprintModel";
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
    const tasks = await TaskModel.find({
      project: projectId,
      $or: [
        { sprint: null },
        { sprint: { $exists: false } }
      ],
      type: { $nin: [TaskType.EPIC, TaskType.SUBTASK] },
    })
      .populate({ path: "epic", select: "title taskKey" })
      .populate({ path: "assignee", select: "-password" })
      .populate({ path: "reporter", select: "-password" })
      .exec();
    return tasks as ITask[];
  }


  async update(id: string, taskData: Partial<ITask>): Promise<ITask | null> {
    const updatedTask = await TaskModel.findByIdAndUpdate(
      id,
      { ...taskData, updatedAt: new Date() },
      { new: true }
    )
      .populate({ path: "epic", select: "title taskKey" })
      .populate({ path: "assignee", select: "-password" })
      .populate({ path: "reporter", select: "-password" });

    return updatedTask as ITask | null;
  }

  async delete(taskId: string): Promise<void> {
    await TaskModel.findByIdAndDelete(taskId);
  }

  async updateMany(filter: any, update: Partial<ITask>): Promise<void> {
    await TaskModel.updateMany(filter, update).exec();
  }



  async findTasksBySprintStatus(projectId: string, status: SprintStatus): Promise<ITask[]> {
    const sprints = await SprintModel.find({ project: projectId, status }, '_id').lean().exec();
    const sprintIds = sprints.map((sprint) => sprint._id);
    const tasks = await TaskModel.find({
      project: projectId,
      sprint: { $in: sprintIds },
      type: { $nin: [TaskType.EPIC, TaskType.SUBTASK] },
    })
      .select('taskKey title description type status priority assignee reporter epic sprint storyPoints files createdAt updatedAt project workspace')
      .populate({ path: 'epic', select: 'title taskKey' })
      .populate({ path: 'assignee', select: '-password' })
      .populate({ path: 'reporter', select: '-password' })
      .lean()
      .exec();
    return tasks as ITask[];
  }


  //  async findTaskByProjects(projectId: string): Promise<ITask[]> {
  //      return await TaskModel.find({project: projectId})
  //  }

  async findTaskByProjects(projectId: string): Promise<ITask[]> {
    const tasks = await TaskModel.find({
      project: projectId,
      type: { $ne: TaskType.EPIC }, 
    })
      .select('taskKey title description type status priority assignee reporter epic sprint storyPoints files createdAt updatedAt project workspace')
      .populate({ path: 'epic', select: 'title taskKey' })
      .populate({ path: 'assignee', select: '-password' })
      .populate({ path: 'reporter', select: '-password' })
      .lean()
      .exec();
    return tasks as ITask[];
  }


}