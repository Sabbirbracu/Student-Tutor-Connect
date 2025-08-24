// import Course from "../models/Courses.js";
// import User from "../models/User.js";

// export const listCourses = async (req, res) => {
//   const { q } = req.query;
//   const filter = q ? { $text: { $search: q } } : {};
//   const courses = await Course.find(filter).select(
//     "name code description tutors"
//   );
//   res.json(courses);
// };

// export const createCourse = async (req, res) => {
//   try {
//     const { name, code, description } = req.body;
//     if (!name || !code || !description) {
//       return res.status(400).json({ message: "All fields are required" });
//     } else {
//       const exists = await Course.findOne({ code });
//       if (exists)
//         return res.status(400).json({ message: "Course code exists" });
//       const course = await Course.create({ name, code, description });
//       res.status(201).json(course);
//     }
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const deleteCourse = async (req, res) => {
//   await Course.findByIdAndDelete(req.params.id);
//   res.json({ message: "Course deleted" });
// };

// export const getCourseTutors = async (req, res) => {
//   const course = await Course.findById(req.params.id).populate(
//     "studentTutor",
//     "name email"
//   );
//   if (!course) return res.status(404).json({ message: "Course not found" });
//   res.json(course.tutors);
// };

// export const assignTutorToCourse = async (req, res) => {
//   const { tutorId } = req.body;
//   const course = await Course.findById(req.params.id);
//   const tutor = await User.findById(tutorId);

//   if (!course || !tutor)
//     return res.status(404).json({ message: "Course or tutor not found" });

//   if (tutor.role !== "studentTutor")
//     return res.status(400).json({ message: "User is not a tutor" });

//   // ✅ Add tutor to course
//   if (!course.tutors.includes(tutor._id)) {
//     course.tutors.push(tutor._id);
//     await course.save();
//   }

//   // ✅ Add course to tutor’s assigned courses
//   if (!tutor.coursesAssigned?.includes(course._id)) {
//     tutor.coursesAssigned.push(course._id);
//     await tutor.save();
//   }

//   res.json({
//     message: "Tutor assigned",
//     courseId: course._id,
//     tutorId: tutor._id,
//   });
// };

import Course from "../models/Courses.js";
import User from "../models/User.js";

// ============================
// 1️⃣ List all courses (with optional search)
// ============================
export const listCourses = async (req, res) => {
  const { q } = req.query;
  const filter = q ? { $text: { $search: q } } : {};
  const courses = await Course.find(filter).select(
    "name code description tutors"
  );
  res.json(courses);
};

// ============================
// 2️⃣ Create a new course (admin only)
// ============================
export const createCourse = async (req, res) => {
  try {
    const { name, code, description } = req.body;

    // Validate input
    if (!name || !code || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if course code already exists
    const exists = await Course.findOne({ code });
    if (exists) {
      return res.status(400).json({ message: "Course code exists" });
    }

    const course = await Course.create({ name, code, description });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================
// 3️⃣ Delete a course (admin only)
// ============================
// This route deletes a course by its ID. Make sure to protect this route
// with admin authentication and proper authorization.
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================
// 4️⃣ Get all tutors assigned to a course
// ============================
export const getCourseTutors = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "studentTutor",
      "name email"
    );
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course.tutors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================
// 5️⃣ Assign a tutor to a course (admin only)
// ============================
export const assignTutorToCourse = async (req, res) => {
  try {
    const { tutorId } = req.body;
    const course = await Course.findById(req.params.id);
    const tutor = await User.findById(tutorId);

    if (!course || !tutor)
      return res.status(404).json({ message: "Course or tutor not found" });

    if (tutor.role !== "studentTutor")
      return res.status(400).json({ message: "User is not a tutor" });

    // Add tutor to course if not already added
    if (!course.tutors.includes(tutor._id)) {
      course.tutors.push(tutor._id);
      await course.save();
    }

    // Add course to tutor’s assigned courses if not already added
    if (!tutor.coursesAssigned?.includes(course._id)) {
      tutor.coursesAssigned.push(course._id);
      await tutor.save();
    }

    res.json({
      message: "Tutor assigned",
      courseId: course._id,
      tutorId: tutor._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
