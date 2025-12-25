import { User } from "../models/users.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        if (!fullname || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be of minimum six characters!"
            });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists!"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullname,
            email,
            password: hashPassword,
        });

        const userResponse = {
            _id: newUser._id,
            fullname: newUser.fullname,
            email: newUser.email,
            profilePicture: newUser?.profilePicture
        }

        return res.status(201).json({
            success: true,
            message: "User registered successfully!",
            user: userResponse
        });

    } catch (error) {
        console.log("User failed to register \n", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found!"
            });
        }

        const isMatchedPassword = await bcrypt.compare(password, user.password);
        if (!isMatchedPassword) {
            return res.status(400).json({
                success: false,
                message: "Password is incorrect!"
            });
        }

        const userResponse = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilePicture: user?.profilePicture,
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        return res
            .cookie("token", token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true })
            .json({
                success: true,
                message: `Welcome back ${user.fullname}!`,
                user: userResponse
            });

    } catch (error) {
        console.log("Failed to Login \n", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        });
    }
}

export const logoutUser = (req, res) => {
    try {
        res
            .cookie("token", "", { maxAge: 0 })
            .json({
                success: true,
                message: "Logged out successfully!"
            });
    } catch (error) {
        console.log("Failed to logout \n", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        });
    }
}

export const updateProfile = async () => {
    try {
        
    } catch (error) {
        console.log("Failed to Update Profile \n", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        });
    }
}