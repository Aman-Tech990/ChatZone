import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";

if (process.env.NODE_ENV !== "production") {
    dotenv.config({});
}

const app = express();
const PORT = process.env.PORT || 5005;

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});