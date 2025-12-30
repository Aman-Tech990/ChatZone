import jwt from "jsonwebtoken";
import { User } from "../models/users.model.js";

const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Expect: Authorization: Bearer <token>
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized User!",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token!",
        });
    }
};

export default isAuthenticated;
