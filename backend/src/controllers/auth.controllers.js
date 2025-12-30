import { User } from "../models/users.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";

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

        const newUser = new User({
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

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            return res.status(201).json({
                success: true,
                message: "User registered successfully!",
                user: userResponse,
                token
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid user data!"
            });
        }

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
            return res.status(404).json({
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

        generateToken(user._id, res);

        return res
            .json({
                success: true,
                message: `Welcome back ${user.fullname}!`,
                user: userResponse,
                token
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
            .status(200)
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

export const updateProfile = async (req, res) => {
    try {
        const { profilePicture } = req.body;
        const userId = req.user._id;

        if (!profilePicture) {
            return res.status(404).json({
                success: false,
                message: "Profile Picture is required!"
            });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePicture);

        const updatedUser = await User.findByIdAndUpdate(userId, { profilePicture: uploadResponse.secure_url }, { new: true });

        return res.status(200).json({
            success: true,
            message: `${req.user.fullname}'s Profile updated successfully!`,
            updatedUser
        });

    } catch (error) {
        console.log("Failed to Update Profile \n", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        });
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        });
    }
}