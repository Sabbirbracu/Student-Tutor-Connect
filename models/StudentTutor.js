// models/StudentTutor.js
import mongoose from "mongoose";
import User from "./user.js";

const studentTutorSchema = new mongoose.Schema({
  coursesAssigned: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  ratings: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
      review: { type: String },
    },
  ],
  blocked: { type: Boolean, default: false },
});

const StudentTutor = User.discriminator("studentTutor", studentTutorSchema);
export default StudentTutor;
