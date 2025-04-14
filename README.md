import mongoose, { Schema, Document } from "mongoose";
import { ISprint, SprintStatus } from "../../../domain/entities/sprint";

const sprintSchema = new Schema<ISprint & Document>({
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  workspace: { type: Schema.Types.ObjectId, ref: "WorkSpace", required: true },
  name: { type: String, required: true },
  goal: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  status: {
    type: String,
    enum: Object.values(SprintStatus),
    default: SprintStatus.PLANNED,
  },
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  createdAt: { type: Date, default: Date.now },
});

sprintSchema.index({ project: 1, status: 1 });

export default mongoose.model<ISprint>("Sprint", sprintSchema);