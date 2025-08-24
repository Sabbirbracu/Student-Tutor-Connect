import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: { type: String, required: true },
    severity: { type: String, enum: ["low", "medium", "high"], default: "low" },
    status: { type: String, enum: ["pending", "reviewed"], default: "pending" },
    actionTaken: {
      type: String,
      enum: ["none", "warning", "ban"],
      default: "none",
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;
