import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Student from "../models/Student.js";
import StudentTutor from "../models/StudentTutor.js";
import User from "../models/User.js";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc Register new user
// @route POST /api/auth/register
// @access Public
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Please add all fields" });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let user;

  if (role === "admin") {
    user = await Admin.create({ name, email, password: hashedPassword });
  } else if (role === "student") {
    user = await Student.create({ name, email, password: hashedPassword });
  } else if (role === "studentTutor") {
    user = await StudentTutor.create({ name, email, password: hashedPassword });
  } else {
    return res.status(400).json({ message: "Invalid role" });
  }

  res.status(201).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role, // will now be saved
    token: generateToken(user._id),
  });
};

// @desc Authenticate user & get token
// @route POST /api/auth/login
// @access Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

// @desc Get current user
// @route GET /api/auth/me
// @access Private
export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json(user);
};
