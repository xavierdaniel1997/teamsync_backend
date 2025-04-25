async execute(dto: CreateTaskDTO, userId: string): Promise<void> {
  // Validate workspace
  const workspace = await this.workspaceRepo.findById(dto.workspace);
  if (!workspace) {
    throw new Error("Workspace not found");
  }

  // Validate project access
  const project = await this.projectRepo.findUserAccess(dto.project, userId);
  if (!project) {
    throw new Error("Project not found or user does not have access");
  }
  const isOwner = project.owner.toString() === userId;
  const member = project.members.find((member) => member.user.toString() === userId);
  const hasWriteAccess = isOwner || (member && member.accessLevel === ProjectAccessLevel.WRITE);
  if (!hasWriteAccess) {
    throw new Error("User does not have permission to create tasks");
  }

  // Validate epic-specific rules
  if (dto.type === TaskType.EPIC) {
    if (dto.epic || dto.parent) {
      throw new Error("Epics cannot have an epic or parent");
    }
  }

  // Generate task key (e.g., WEBSITE-1)
  const lastTask = await this.taskRepo.findBykey({ project: dto.project }).sort({ createdAt: -1 }).limit(1);
  const taskNumber = lastTask ? parseInt(lastTask.key.split("-")[1]) + 1 : 1;
  const taskKey = `${project.projectkey}-${taskNumber}`;

  const taskData: Partial<ITask> = {
    project: dto.project,
    workspace: dto.workspace,
    key: taskKey,
    title: dto.title,
    description: dto.description,
    type: dto.type,
    status: dto.status || TaskStatus.TO_DO,
    priority: dto.priority || TaskPriority.MEDIUM,
    assignee: dto.assignee || undefined,
    reporter: userId,
    epic: dto.epic || undefined,
    parent: dto.parent || undefined,
    sprint: dto.sprint || undefined,
    storyPoints: dto.storyPoints,
    files: dto.files || [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const task = await this.taskRepo.create(taskData);

  // Add to project backlog if no sprint is specified
  if (!dto.sprint) {
    await this.projectRepo.update(project._id, { $push: { backlog: task._id } });
  }

  console.log("created task", task);
}