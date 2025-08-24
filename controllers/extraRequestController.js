// controllers/extraRequestController.js
import ExtraRequest from "../models/ExtraRequest.js";

// ✅ Create Extra Request
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
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get All Extra Requests by Logged-In Student
export const getMyExtraRequests = async (req, res) => {
  try {
    const requests = await ExtraRequest.find({ student: req.user._id })
      .populate("tutor", "name email")
      .populate("course", "title code");

    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get Extra Requests for Tutor (Tutor's Dashboard)
export const getTutorExtraRequests = async (req, res) => {
  try {
    const requests = await ExtraRequest.find({ tutor: req.user._id })
      .populate("student", "name email")
      .populate("course", "title code");

    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Update Extra Request Status (Tutor can accept/reject)
export const updateExtraRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const extraRequest = await ExtraRequest.findById(id);

    if (!extraRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    extraRequest.status = status; // "approved" or "rejected"
    await extraRequest.save();

    res.status(200).json(extraRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
