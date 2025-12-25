import express from "express";
import { loginUser, logoutUser, registerUser, updateProfile } from "../controllers/auth.controllers.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.put("/updateProfile", isAuthenticated, updateProfile);

export default router;