import mongoose from "mongoose";
import Review from "../models/Review.js";
import User from "../models/User.js";

// Create a new review for a StudentTutor
export const createReview = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { studentTutor, course, review } = req.body;

    // Validate fields
    if (!studentTutor || !mongoose.Types.ObjectId.isValid(studentTutor)) {
      return res.status(400).json({ message: "Valid tutor ID is required." });
    }
    if (!course || !mongoose.Types.ObjectId.isValid(course)) {
      return res.status(400).json({ message: "Valid course ID is required." });
    }
    if (!review || review.trim().length === 0) {
      return res.status(400).json({ message: "Review text is required." });
    }

    // Check if tutor exists and is a studentTutor
    const tutorUser = await User.findById(studentTutor);
    console.log("Tutor found in DB:", tutorUser);

    if (!tutorUser || tutorUser.role !== "studentTutor") {
      return res.status(400).json({ message: "Invalid Student Tutor" });
    }

    // Create the review
    const doc = await Review.create({
      student: req.user._id, // From auth middleware
      studentTutor: studentTutor, // ✅ Corrected field name
      course,
      review,
    });

    console.log("Review created:", doc);
    res.status(201).json(doc);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all reviews for a StudentTutor
export const getTutorReviews = async (req, res) => {
  try {
    const { tutorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tutorId)) {
      return res.status(400).json({ message: "Invalid Tutor ID" });
    }

    // Fetch reviews with course info
    const reviews = await Review.find({ studentTutor: tutorId })
      .sort("-createdAt")
      .select("review course createdAt")
      .populate("course", "name code"); // Optional: show course details

    // Summary stats
    const stats = await Review.aggregate([
      { $match: { studentTutor: new mongoose.Types.ObjectId(tutorId) } },
      { $group: { _id: "$studentTutor", count: { $sum: 1 } } },
    ]);

    res.json({ reviews, summary: stats[0] || { count: 0 } });
  } catch (error) {
    console.error("Error fetching tutor reviews:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
