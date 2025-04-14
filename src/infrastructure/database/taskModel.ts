import mongoose, { Schema, Document } from "mongoose";
import { ITask, TaskPriority, TaskStatus, TaskType } from "../../domain/entities/task";

const taskSchema = new Schema<ITask & Document>({
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  workspace: { type: Schema.Types.ObjectId, ref: "WorkSpace", required: true },
  key: { type: String, required: true, unique: true },
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
//   reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
  epic: { type: Schema.Types.ObjectId, ref: "Task" },
  parent: { type: Schema.Types.ObjectId, ref: "Task" },
  sprint: { type: Schema.Types.ObjectId, ref: "Sprint" },
  storyPoints: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// taskSchema.pre("save", function (next) {
//   this.updatedAt = new Date();
//   next();
// });

// taskSchema.index({ project: 1, sprint: 1, status: 1 });

export default mongoose.model<ITask>("Task", taskSchema);