import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: { type: String },
    tutors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // tutors teaching this course
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
