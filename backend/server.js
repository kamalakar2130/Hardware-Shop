import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js"; // Adjust path if needed
import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // your React frontend URL
    credentials: true, // allow cookies to pass
  })
);
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/api/users", userRoutes); // User CRUD or info
app.use("/api/auth", authRoutes); // Login, Register, JWT, etc.

// ✅ Basic route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
