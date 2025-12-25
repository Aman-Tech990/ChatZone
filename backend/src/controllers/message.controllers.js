import cloudinary from "../lib/cloudinary.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/users.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");

        return res.status(200).json({
            sucess: true,
            users
        });
    } catch (error) {
        console.log("Failed to fetch users \n", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 });

        return res.status(200).json({
            success: "true",
            messages: `Successfully fetched messages!`,
            messages
        });

    } catch (error) {
        console.log("Failed to fetch messages \n", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.users._id;

        const { text, image } = req.body;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });
        await newMessage.save();

        // Upcoming : Real-time feature (socket.io) -- here ---

        res.status(201).json({
            success: true,
            message: "Message sent successfully!",
            newMessage
        });

    } catch (error) {
        console.log("Failed to send messages \n", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        });
    }
}

