import Slot from "../models/Slot.js";

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

export const mySlots = async (req, res) => {
  // tutors see their slots; students can filter by course
  const filter = {};
  if (req.user.role === "tutor") filter.tutor = req.user._id;
  if (req.query.course) filter.course = req.query.course;
  const slots = await Slot.find(filter)
    .populate("course", "name code")
    .populate("bookedBy", "name");
  res.json(slots);
};

export const courseSlots = async (req, res) => {
  const { courseId } = req.params;
  const slots = await Slot.find({
    course: courseId,
    isBooked: false,
    startTime: { $gte: new Date() },
  }).populate("tutor", "name email");
  res.json(slots);
};

export const bookSlot = async (req, res) => {
  // student books an open slot
  const slot = await Slot.findById(req.params.id);
  if (!slot) return res.status(404).json({ message: "Slot not found" });
  if (slot.isBooked)
    return res.status(400).json({ message: "Slot already booked" });
  slot.isBooked = true;
  slot.bookedBy = req.user._id;
  await slot.save();
  res.json({ message: "Booked", slotId: slot._id });
};

export const cancelSlot = async (req, res) => {
  const slot = await Slot.findById(req.params.id);
  if (!slot) return res.status(404).json({ message: "Slot not found" });

  // allow the student who booked OR the tutor who owns it
  const isOwner =
    req.user.role === "tutor" && String(slot.tutor) === String(req.user._id);
  const isBooker =
    req.user.role === "student" &&
    String(slot.bookedBy) === String(req.user._id);

  if (!isOwner && !isBooker)
    return res.status(403).json({ message: "Not allowed" });

  slot.isBooked = false;
  slot.bookedBy = undefined;
  await slot.save();
  res.json({ message: "Booking canceled" });
};

export const deleteSlot = async (req, res) => {
  const slot = await Slot.findById(req.params.id);
  if (!slot) return res.status(404).json({ message: "Slot not found" });
  if (String(slot.tutor) !== String(req.user._id))
    return res.status(403).json({ message: "Not allowed" });
  await slot.deleteOne();
  res.json({ message: "Slot deleted" });
};
