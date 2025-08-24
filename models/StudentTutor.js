// models/StudentTutor.js
import mongoose from "mongoose";
import User from "./User.js";

const studentTutorSchema = new mongoose.Schema({
  // List of courses assigned to this student tutor
  coursesAssigned: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],

  // Text reviews submitted by students
  reviews: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      review: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],

  blocked: { type: Boolean, default: false },
});

// Create discriminator for StudentTutor
const StudentTutor = User.discriminator("studentTutor", studentTutorSchema);
export default StudentTutor;
