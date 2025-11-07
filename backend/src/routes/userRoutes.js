import express from "express";
import {
  getUsers,
  getUserById,
  getUserProfile,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(authMiddleware, getUsers);
router.route("/profile").get(authMiddleware, getUserProfile);
router.route("/:id").get(authMiddleware, getUserById);

export default router;
