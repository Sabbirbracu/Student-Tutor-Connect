import User from "../models/User.js";

// @desc   Get all users
// @route  GET /api/users
// @access Public (for now)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
