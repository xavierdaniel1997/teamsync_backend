import mongoose, { Schema, Document } from "mongoose";
import { ISprint, SprintStatus } from "../../domain/entities/sprint";

const sprintSchema = new Schema<ISprint & Document>({
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  workspace: { type: Schema.Types.ObjectId, ref: "WorkSpace", required: true },
  sprintName: { type: String, required: true },
  duration: {type: String}, 
  startDate: { type: Date },
  endDate: { type: Date },
  goal: { type: String },
  status: {
    type: String,
    enum: Object.values(SprintStatus),
    required: true,
    default: SprintStatus.PLANNED,
  },
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task", default: [] }],
  description: {type: String},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const SprintModel = mongoose.model<ISprint>("Sprint", sprintSchema);
export default SprintModel;