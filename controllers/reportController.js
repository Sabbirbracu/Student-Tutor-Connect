import Report from "../models/Report.js";
import User from "../models/User.js";

export const createReport = async (req, res) => {
  const { reportedUser, reason, severity } = req.body;
  const doc = await Report.create({
    reporter: req.user._id,
    reportedUser,
    reason,
    severity,
  });
  res.status(201).json(doc);
};

export const listReports = async (req, res) => {
  const { status, severity } = req.query;
  const filter = {};
  if (severity) filter.severity = severity;
  const reports = await Report.find(filter)
    .populate("reporter", "name email role")
    .populate("reportedUser", "name email role blocked")
    .sort("-createdAt");
  res.json(reports);
};

export const actOnReport = async (req, res) => {
  const { action } = req.body; // "none" | "warning" | "ban"
  if (!["none", "warning", "ban"].includes(action))
    return res.status(400).json({ message: "Invalid action" });

  const report = await Report.findById(req.params.id);
  if (!report) return res.status(404).json({ message: "Report not found" });

  report.actionTaken = action;
  report.reviewedBy = req.user._id;
  await report.save();

  if (action === "ban") {
    await User.findByIdAndUpdate(report.reportedUser, { blocked: true });
  }

  res.json({ message: "Action recorded", report });
};
