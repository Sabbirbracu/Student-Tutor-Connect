import ExtraRequest from "../models/ExtraRequest.js";
import Slot from "../models/Slot.js";

// 1️⃣ StudentTutor creates slot
export const createSlot = async (req, res) => {
  const { course, startTime, endTime } = req.body;
  const slot = await Slot.create({
    tutor: req.user._id,
    course,
    startTime,
    endTime,
  });
  res.status(201).json(slot);
};

// 2️⃣ Students view slots (filter by course)
export const viewSlots = async (req, res) => {
  const { courseId } = req.query;
  const filter = {};
  if (courseId) filter.course = courseId;

  const slots = await Slot.find(filter)
    .populate("tutor", "name email")
    .populate("course", "name code");
  res.json(slots);
};

// 3️⃣ Student requests extra slot
export const requestExtraSlot = async (req, res) => {
  const { tutorId, courseId, requestedTime } = req.body;

  const extraRequest = await ExtraRequest.create({
    student: req.user._id,
    tutor: tutorId,
    course: courseId,
    requestedTime,
    status: "pending",
  });

  res.status(201).json(extraRequest);
};

// 4️⃣ StudentTutor approves/rejects extra slot
export const updateExtraSlotRequest = async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body; // accepted or rejected

  const request = await ExtraRequest.findById(requestId);
  if (!request) return res.status(404).json({ message: "Request not found" });

  if (String(request.tutor) !== String(req.user._id))
    return res.status(403).json({ message: "Not allowed" });

  request.status = status;
  await request.save();
  res.json(request);
};
