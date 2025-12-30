import jwt from "jsonwebtoken";
import { User } from "../models/users.model.js";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized User!"
            });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (!decode) {
            return res.status(404).json({
                success: false,
                message: "Unauthorized User!"
            });
        }

        const user = await User.findById(decode.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }
        req.user = user;
        next();

    } catch (error) {
        console.log("Middleware --> Server Issue \n", error);
        return res.status(500).json({
            success: false,
            message: "Middleware --> Internal Server Error!"
        });
    }
}

export default isAuthenticated;