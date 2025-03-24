import mongoose, {Schema, Document, mongo} from "mongoose";
import {IWorkspace, WorkSpacePlan} from "../../domain/entities/workSpace";

const workSpaceSchem = new Schema<IWorkspace & Document>({
  name: {type: String, required: true},
  owner: {type: Schema.Types.ObjectId, ref: "User", required: true},
  members: {type: [{type: Schema.Types.ObjectId, ref: "User"}], default: []},
  projects: {
    type: [{type: Schema.Types.ObjectId, ref: "Project"}],
    default: [],
  },
  teams: {type: [{type: Schema.Types.ObjectId, ref: "Team"}], default: []},
  plan: {
    type: String,
    enum: Object.values(WorkSpacePlan),
    default: WorkSpacePlan.FREE,
  },
  createdAt: {type: Date, default: Date.now},
});


const WorkSpaceModel = mongoose.model<IWorkspace>("WorkSpace", workSpaceSchem);
export default WorkSpaceModel;