// userController.js
import User from "../models/User.js";

// @desc   Get all tutors
// @route  GET /api/users?tutor=true
// @access Public (for now)
export const getUsers = async (req, res) => {
  try {
    const { tutor } = req.query;
    let users;

    if (tutor === "true") {
      // fetch only users with role studentTutor
      users = await User.find({ role: "studentTutor" }).select("name email");
    } else {
      // fetch all users
      users = await User.find({}).select("name email role");
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
