import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// dotenv config
if (process.env.NODE_ENV !== "production") {
    dotenv.config({});
}

// Database Connection
connectDB();

// App Initialization
const app = express();
const PORT = process.env.PORT || 5005;

// CORS Setup
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Default Middlewares
app.use(express.json({ limit: "100mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// APIs
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// App entry point
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});