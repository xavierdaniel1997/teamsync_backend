import mongoose, { Schema, Document } from "mongoose";
import { ITask, TaskPriority, TaskStatus, TaskType } from "../../domain/entities/task";

const taskSchema = new Schema<ITask & Document>({
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  workspace: { type: Schema.Types.ObjectId, ref: "WorkSpace", required: true },
  taskKey: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  type: {
    type: String,
    enum: Object.values(TaskType), 
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(TaskStatus),
    default: TaskStatus.TO_DO,
  },
  priority: {
    type: String,
    enum: Object.values(TaskPriority),
    default: TaskPriority.MEDIUM,
  },
  assignee: { type: Schema.Types.ObjectId, ref: "User" },
  reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
  epic: { type: Schema.Types.ObjectId, ref: "Task" },
  parent: { type: Schema.Types.ObjectId, ref: "Task" },
  sprint: { type: Schema.Types.ObjectId, ref: "Sprint" },
  storyPoints: { type: Number },
  files: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


const TaskModel =  mongoose.model<ITask>("Task", taskSchema);
export default TaskModel;
