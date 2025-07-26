import { ITask } from "../../../domain/entities/task";
import { IProjectRepo } from "../../../domain/repositories/projectRepo";
import { ITaskRepository } from "../../../domain/repositories/taskRepository";
import { IUserRepository } from "../../../domain/repositories/userRepo";
import { IWorkSpaceRepo } from "../../../domain/repositories/workSpaceRepo";

export class GetEpicsByProjectUseCase {
    constructor(
        private taskRepo: ITaskRepository,
        private projectRepo: IProjectRepo,
        private workspaceRepo: IWorkSpaceRepo,
        private userRepo: IUserRepository
    ) { }

    async execute(projectId: string, userId: string): Promise<ITask[]> {

        const project = await this.projectRepo.findById(projectId);
        if (!project) {
            throw new Error("Project not found");
        }


        const isMember = project.members.some(
            (member) => member.user._id.toString() === userId
        );
        const isOwner = project.owner._id.toString() === userId;
        if (!isMember && !isOwner) {
            throw new Error("User does not have access to this project");
        }

        const epics = await this.taskRepo.findEpicsByProject(projectId);
        if (!epics) {
            throw new Error("Epics not found")
        }



        // const epicsWithProgress = await Promise.all(
        //     epics.map(async (epic: any) => {
        //         const tasks = await this.taskRepo.findTasksByEpic(epic._id.toString());

        //         console.log("tasks form the epics", tasks)
        //     })
        // );

        // epicsWithProgress


        const epicsWithProgress = await Promise.all(
            epics.map(async (epic: any) => {
                const tasks = await this.taskRepo.findTasksByEpic(epic._id.toString());

                const statusCount: Record<string, number> = {
                    TO_DO: 0,
                    IN_PROGRESS: 0,
                    IN_REVIEW: 0,
                    DONE: 0,
                };

                for (const task of tasks) {
                    statusCount[task.status] = (statusCount[task.status] || 0) + 1;
                }

                const total = tasks.length || 1; // prevent division by 0
                const done = statusCount["DONE"];
                const inProgress = statusCount["IN_PROGRESS"];
                const toDo = statusCount["TO_DO"];
                const inReview = statusCount["IN_REVIEW"];

                // Calculate percentage
                const progressPercent = Math.round((done / total) * 100);

                  return {
                    ...epic.toObject(),
                    progress: {
                      TO_DO: Math.round((toDo / total) * 100),
                      IN_PROGRESS: Math.round((inProgress / total) * 100),
                      IN_REVIEW: Math.round((inReview / total) * 100),
                      DONE: Math.round((done / total) * 100),
                      total: progressPercent,
                    }
                  };

            })
        );
        // console.log("epicsWithProgress........................", epicsWithProgress)

        return epicsWithProgress;

    }
}