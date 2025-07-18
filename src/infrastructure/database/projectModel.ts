import mongoose, { Schema } from "mongoose";
import { IProject, ProjectAccessLevel } from "../../domain/entities/project";

const projectSchema = new Schema<IProject>({
    projectkey: { type: String, required: true },
    name: { type: String, required: true },
    title: { type: String },
    description: { type: String },
    projectCoverImg: { type: String },
    workspace: { type: Schema.Types.ObjectId, ref: "WorkSpace", required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // color: {type: String},
    color: { class: {type: String}, hex: {type: String} },
    members: [
        {   
            user: { type: Schema.Types.ObjectId, ref: "User" },
            accessLevel: {
                type: String,
                enum: Object.values(ProjectAccessLevel),
                default: ProjectAccessLevel.NONE,
            },
        },
    ],
    invitations: [{ type: Schema.Types.ObjectId, ref: "Invitation", default: [] }],
    backlog: [{ type: Schema.Types.ObjectId, ref: "Task", default: [] }],
    sprints: [{ type: Schema.Types.ObjectId, ref: "Sprint", default: [] }],  
    taskCounter: {type: Number, default: 0},
    createdAt: { type: Date, default: Date.now },
})

const ProjectModel = mongoose.model<IProject>('Project', projectSchema)
export default ProjectModel;        