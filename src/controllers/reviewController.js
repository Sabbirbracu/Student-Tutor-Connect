import Review from "../models/Review.js";
import User from "../models/User.js";

export const createReview = async (req, res) => {
  const { tutor, course, rating, review } = req.body;
  const tutorUser = await User.findById(tutor);
  if (!tutorUser || tutorUser.role !== "tutor")
    return res.status(400).json({ message: "Invalid tutor" });

  const doc = await Review.create({
    student: req.user._id,
    tutor,
    course,
    rating,
    review,
  });
  res.status(201).json(doc);
};

export const getTutorReviews = async (req, res) => {
  const { tutorId } = req.params;
  const reviews = await Review.find({ tutor: tutorId }).sort("-createdAt");
  const stats = await Review.aggregate([
    {
      $match: {
        tutor: new (await import("mongoose")).default.Types.ObjectId(tutorId),
      },
    },
    {
      $group: {
        _id: "$tutor",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);
  res.json({ reviews, summary: stats[0] || { avgRating: 0, count: 0 } });
};
