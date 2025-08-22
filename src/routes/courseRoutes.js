import express from "express";
import {
  assignTutorToCourse,
  createCourse,
  deleteCourse,
  getCourseTutors,
  listCourses,
} from "../controllers/courseController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", listCourses); // public search/list
router.get("/:id/tutors", getCourseTutors); // public: find STs per course

router.post("/", protect, requireRole("admin"), createCourse); // Admin add
router.delete("/:id", protect, requireRole("admin"), deleteCourse); // Admin delete
router.post(
  "/:id/assign-tutor",
  protect,
  requireRole("admin"),
  assignTutorToCourse
); // Admin assign

export default router;
