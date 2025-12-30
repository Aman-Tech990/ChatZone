import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server, io } from "./lib/socket.js";

// dotenv config
if (process.env.NODE_ENV !== "production") {
    dotenv.config({});
}

// Database Connection
connectDB();

// Defining PORT 
const PORT = process.env.PORT || 5005;

// CORS Setup
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://chatzone-henna.vercel.app"
    ],
    credentials: true
}));

app.set("trust proxy", 1);

// Default Middlewares
app.use(express.json({ limit: "100mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// APIs
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// App entry point
server.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});