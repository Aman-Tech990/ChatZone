import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controllers.js";

const router = express.Router();

router.get("/users", isAuthenticated, getUsersForSidebar);
router.get("/:id", isAuthenticated, getMessages);
router.post("/send/:id", isAuthenticated, sendMessage);
export default router;