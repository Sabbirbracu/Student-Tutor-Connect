// routes/extraRequestRoutes.js
import express from "express";
import { createExtraRequest } from "../controllers/extraRequestController.js";
import { protect } from "../middleware/authMiddleware.js"; // your auth middleware

const router = express.Router();

// POST /api/extra-requests
router.post("/", protect, createExtraRequest);

export default router;
