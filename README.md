 const filter: any = {
      project: new mongoose.Types.ObjectId(projectId),
      type: { $nin: [TaskType.EPIC, TaskType.SUBTASK] },
    };

    if (assignees && assignees.length > 0) {
      filter.assignee = {
        $in: assignees.map(id => new mongoose.Types.ObjectId(id))
      };
    }

    if (epics && epics.length > 0) {
      filter.epic = {
        $in: epics.map(id => new mongoose.Types.ObjectId(id))
      };
      console.log("inside the epic filter $$$$$$$$$$$$$$$$$$$$$$$$$$4", filter.epic)
    }

    console.log("filterrrrrrrrrrrrrrrrrrrrrrrrrr", filter)
    const tasks = await TaskModel.find(filter)
      .select('taskKey title description type status priority assignee reporter epic sprint storyPoints files createdAt updatedAt project workspace')
      .populate({ path: 'epic', select: 'title taskKey' })
      .populate({ path: 'assignee', select: '-password' })
      .populate({ path: 'reporter', select: '-password' })
      .lean()
      .exec();

    console.log("form the output of the get backlog tasks...................", tasks)

    return tasks as ITask[];











            const {assignees, epics} = req.query;
        
        console.log("direct form the assingess", assignees, "and", epics)
        const assigneesArray = Array.isArray(assignees)
            ? assignees.filter((item): item is string => typeof item === "string")
            : typeof assignees === "string"
            ? assignees.split(",")
            : undefined;

        const epicsArray = Array.isArray(epics)
            ? epics.filter((item): item is string => typeof item === "string")
            : typeof epics === "string"
            ? epics.split(",")
            : undefined;

        console.log("from the getTasksController assignees query", assigneesArray, "and the epic selected", epicsArray);