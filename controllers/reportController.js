import Report from "../models/Report.js";
import User from "../models/User.js";
// ============================
// 1️⃣ Create a report
// ============================
export const createReport = async (req, res) => {
  const { reportedUser, reason, severity } = req.body;

  // Validation: reportedUser must exist and cannot report self
  if (!reportedUser || reportedUser === req.user._id.toString()) {
    return res.status(400).json({ message: "Invalid reported user" });
  }

  const userExists = await User.findById(reportedUser);
  if (!userExists) {
    return res.status(404).json({ message: "Reported user not found" });
  }

  try {
    const doc = await Report.create({
      reporter: req.user._id,
      reportedUser,
      reason,
      severity,
      status: "pending",
    });

    res.status(201).json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ============================
// 2️⃣ List reports (admin only)
// ============================
export const listReports = async (req, res) => {
  const { status, severity } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (severity) filter.severity = severity;

  try {
    const reports = await Report.find(filter)
      .populate("reporter", "name email role")
      .populate("reportedUser", "name email role blocked")
      .sort("-createdAt");

    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ============================
// 3️⃣ Act on report (admin only)
// ============================
// export const actOnReport = async (req, res) => {
//   const { action } = req.body; // "none" | "warning" | "ban"
//   if (!["none", "warning", "ban"].includes(action))
//     return res.status(400).json({ message: "Invalid action" });

//   try {
//     const report = await Report.findById(req.params.id);
//     if (!report) return res.status(404).json({ message: "Report not found" });

//     report.actionTaken = action;
//     report.reviewedBy = req.user._id;
//     report.status = "reviewed"; // mark report as reviewed
//     await report.save();

//     if (action === "ban") {
//       const updatedUser = await User.findByIdAndUpdate(
//         report.reportedUser,
//         { blocked: true },
//         { new: true } // return the updated document
//       );
//       console.log("User banned:", updatedUser);
//     } else if (action === "none") {
//       // If action is reverted to none, unblock the user
//       const updatedUser = await User.findByIdAndUpdate(
//         report.reportedUser,
//         { blocked: false },
//         { new: true }
//       );
//       console.log("User unblocked:", updatedUser);
//     }

//     res.json({ message: "Action recorded", report });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// ============================
// 3️⃣ Act on report (admin only)
// ============================
export const actOnReport = async (req, res) => {
  const { action } = req.body; // "none" | "warning" | "ban"
  if (!["none", "warning", "ban"].includes(action)) {
    return res.status(400).json({ message: "Invalid action" });
  }

  try {
    // Find the report
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    // Update report details
    report.actionTaken = action;
    report.reviewedBy = req.user._id;
    report.status = "reviewed"; // mark report as reviewed
    await report.save();

    let updatedUser = null;

    // Update blocked status based on action
    if (action === "ban") {
      updatedUser = await User.findByIdAndUpdate(
        report.reportedUser, // pass directly
        { blocked: true },
        { new: true }
      );
      console.log("User banned:", updatedUser);
    } else if (action === "none") {
      updatedUser = await User.findByIdAndUpdate(
        report.reportedUser, // pass directly
        { blocked: false },
        { new: true }
      );
      console.log("User unblocked:", updatedUser);
    }

    res.json({ message: "Action recorded", report, updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
