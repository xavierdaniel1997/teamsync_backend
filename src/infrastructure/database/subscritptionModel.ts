import mongoose, { Schema } from "mongoose";
import { ISubscription, PlanStatus } from "../../domain/entities/subscription";


const subscriptionSchema = new Schema<ISubscription>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  workspace: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
  plan: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
  stripeSubscriptionId: { type: String },
  stripeCustomerId: { type: String },
  status: { type: String, enum: Object.values(PlanStatus), default: PlanStatus.ACTIVE },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});

const SubscriptionModel = mongoose.model<ISubscription>("Subscription", subscriptionSchema);
export default SubscriptionModel;

