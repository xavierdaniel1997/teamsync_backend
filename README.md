

here I am building a project management system similar to jira, and the main difference is there is chat and video call and it's a subscription based application  like a limitation for creating projects and team members. like free , basic, and premium , I am planning to integreat using strip , and when comes to the task I am planning to creating using a ajil work flow like scrums similar to jira and also the person who creating the application can invite team members and the team members in the same project can chat each other and make video calls so here how can  do it 



//workspace schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workspaceSchema = new Schema({
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }], // All users in the workspace
  projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
  teams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
  plan: { type: String, enum: ["free", "basic", "premium"], default: "free" },
  createdAt: { type: Date, default: Date.now },
});

// Index for efficient member queries
workspaceSchema.index({ members: 1 });

module.exports = mongoose.model("Workspace", workspaceSchema);




//subscriptoin
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
  workspace: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
  stripeSubscriptionId: { type: String, required: true },
  plan: { type: String, enum: ["free", "basic", "premium"], default: "free" },
  projectLimit: { type: Number, default: 1 }, // Free: 1, Basic: 5, Premium: Unlimited
  memberLimit: { type: Number, default: 3 },  // Free: 3, Basic: 10, Premium: Unlimited
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Subscription", subscriptionSchema);





//project scheam
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  name: { type: String, required: true },
  workspace: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  team: { type: Schema.Types.ObjectId, ref: "Team" }, // Optional team assignment
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", projectSchema);




//Team schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teamSchema = new Schema({
  name: { type: String, required: true },
  workspace: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }], // Team-specific members
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Team", teamSchema);