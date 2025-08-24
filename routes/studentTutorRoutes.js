import express from "express";
import { findStudentTutors } from "../controllers/studentTutorController.js";

const router = express.Router();

router.get("/find", findStudentTutors);

export default router;
