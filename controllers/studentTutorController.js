import Course from "../models/Courses.js";

// @desc   Find StudentTutors by course code
// @route  GET /api/find-st
// @access Public
export const findStudentTutors = async (req, res) => {
  try {
    const { courseCode } = req.query;

    if (!courseCode)
      return res.status(400).json({ message: "courseCode is required" });

    // Find course by code and populate its tutors
    const course = await Course.findOne({ code: courseCode }).populate({
      path: "tutors",
      select: "name email coursesAssigned", // include coursesAssigned
      populate: {
        path: "coursesAssigned", // populate the assigned courses
        select: "name code",
      },
    });

    if (!course) return res.json([]); // No course found

    res.json(course.tutors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
