import User from "../models/User.js";
import Course from "../models/Courses.js";

export const listCourses = async (req, res) => {
  const { q } = req.query;
  const filter = q ? { $text: { $search: q } } : {};
  const courses = await Course.find(filter).select("name code description");
  res.json(courses);
};

export const createCourse = async (req, res) => {
  const { name, code, description } = req.body;
  const exists = await Course.findOne({ code });
  if (exists) return res.status(400).json({ message: "Course code exists" });
  const course = await Course.create({ name, code, description });
  res.status(201).json(course);
};

export const deleteCourse = async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: "Course deleted" });
};

export const getCourseTutors = async (req, res) => {
  const course = await Course.findById(req.params.id).populate(
    "studentTutor",
    "name email"
  );
  if (!course) return res.status(404).json({ message: "Course not found" });
  res.json(course.tutors);
};

export const assignTutorToCourse = async (req, res) => {
  const { tutorId } = req.body;
  const course = await Course.findById(req.params.id);
  const tutor = await User.findById(tutorId);

  if (!course || !tutor)
    return res.status(404).json({ message: "Course or tutor not found" });

  if (tutor.role !== "studentTutor")
    return res.status(400).json({ message: "User is not a tutor" });

  // ✅ Add tutor to course
  if (!course.tutors.includes(tutor._id)) {
    course.tutors.push(tutor._id);
    await course.save();
  }

  // ✅ Add course to tutor’s assigned courses
  if (!tutor.coursesAssigned?.includes(course._id)) {
    tutor.coursesAssigned.push(course._id);
    await tutor.save();
  }

  res.json({
    message: "Tutor assigned",
    courseId: course._id,
    tutorId: tutor._id,
  });
};
