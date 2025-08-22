import ExtraRequest from "../models/ExtraRequest.js";

export const createExtraRequest = async (req, res) => {
  const { tutor, course, requestedTime } = req.body;
  const doc = await ExtraRequest.create({
    student: req.user._id,
    tutor,
    course,
    requestedTime,
  });
  res.status(201).json(doc);
};

export const myExtraRequests = async (req, res) => {
  const filter =
    req.user.role === "student"
      ? { student: req.user._id }
      : { tutor: req.user._id };
  const items = await ExtraRequest.find(filter).sort("-createdAt");
  res.json(items);
};

export const actOnExtraRequest = async (req, res) => {
  const { status } = req.body; // "accepted" | "rejected"
  const doc = await ExtraRequest.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Request not found" });
  if (String(doc.tutor) !== String(req.user._id))
    return res.status(403).json({ message: "Not allowed" });
  if (!["accepted", "rejected"].includes(status))
    return res.status(400).json({ message: "Invalid status" });
  doc.status = status;
  await doc.save();
  res.json(doc);
};
