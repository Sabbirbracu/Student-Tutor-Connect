// controllers/extraRequestController.js
import ExtraRequest from "../models/ExtraRequest.js";

export const createExtraRequest = async (req, res) => {
  try {
    const { tutor, course, requestedTime } = req.body;

    const extraRequest = await ExtraRequest.create({
      student: req.user._id, // logged-in student
      tutor,
      course,
      requestedTime,
    });

    res.status(201).json(extraRequest);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
