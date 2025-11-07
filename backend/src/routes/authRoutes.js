import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
} from "../controllers/authController.js";
import { body } from "express-validator";

const router = express.Router();

// 🔐 REGISTER
router.post(
  "/register",
  [
    body("name", "Name is required").not().isEmpty(),
    body("email", "Please include a valid email").isEmail(),
    body(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  registerUser
);

// 🔑 LOGIN
router.post(
  "/login",
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password is required").exists(),
  ],
  loginUser
);

//  forgot password
router.post("/forgot-password", forgotPassword);

export default router;
