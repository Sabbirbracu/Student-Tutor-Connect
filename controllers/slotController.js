import Slot from "../models/Slot.js";

// 1️⃣ Create Slot (StudentTutor)
export const createSlot = async (req, res) => {
  const { course, day, startTime, endTime } = req.body;

  try {
    if (!course || !day || !startTime || !endTime) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const slot = await Slot.create({
      tutor: req.user._id,
      course,
      day,
      startTime,
      endTime,
    });

    res.status(201).json(slot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 2️⃣ Get Tutor's Own Slots
export const getMySlots = async (req, res) => {
  try {
    const slots = await Slot.find({ tutor: req.user._id }).populate(
      "course",
      "name code"
    );
    res.status(200).json(slots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 3️⃣ Update Slot (optional)
export const updateSlot = async (req, res) => {
  const { id } = req.params;
  const { day, startTime, endTime, course } = req.body;

  try {
    const slot = await Slot.findById(id);
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    if (day) slot.day = day;
    if (startTime) slot.startTime = startTime;
    if (endTime) slot.endTime = endTime;
    if (course) slot.course = course;

    await slot.save();
    res.status(200).json(slot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 4️⃣ Get Slots for Students (public)
export const getSlotsForStudent = async (req, res) => {
  try {
    const { tutorId, courseId } = req.query;

    if (!tutorId)
      return res.status(400).json({ message: "Tutor ID is required" });

    const filter = { tutor: tutorId };
    if (courseId) filter.course = courseId;

    const slots = await Slot.find(filter)
      .populate("course", "name code")
      .populate("tutor", "name email");

    res.status(200).json(slots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
