import mongoose, {Schema} from "mongoose";
import {IPlan} from "../../domain/entities/plan";

const planSchema = new Schema<IPlan>({
  name: {type: String, required: true},
  stripePriceId: {type: String},
  stripeProductId: {type: String},
  price: {type: Number, default: 0},
  projectLimit: {type: Number, default: 1},
  memberLimit: {type: Number, default: 3},
  isActive: {type: Boolean, default: true},
  createdAt: {type: Date, default: Date.now},
});

const PlanModel = mongoose.model<IPlan>("Plan", planSchema);
export default PlanModel;
