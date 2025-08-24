import express from "express";
import { getUserById, getUsers } from "../controllers/userController.js";

const router = express.Router();

// GET /api/users
router.get("/", getUsers);

// GET /api/users/:id
router.get("/:id", getUserById);

export default router;
