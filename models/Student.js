// models/Student.js
import mongoose from "mongoose";
import User from "./user.js";

const studentSchema = new mongoose.Schema({
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  blocked: { type: Boolean, default: false },
});

const Student = User.discriminator("student", studentSchema);
export default Student;
