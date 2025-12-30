import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "https://chatzone-oou0.onrender.com";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/checkAuth");
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            console.log("Error in CheckAuth: ", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/register", data);
            if (res?.data?.success) {
                console.log(res?.data);
                localStorage.setItem("token", res.data.token);
                set({ authUser: res?.data?.user });
                get().connectSocket();
                toast.success(res?.data?.message || "User signed up successfully!");
            }
        } catch (error) {
            toast.error(error.response.data.message || "Failed to register user");
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            if (res?.data?.success) {
                console.log(res?.data);
                localStorage.setItem("token", res.data.token);
                set({ authUser: res?.data?.user });
                get().connectSocket();
                toast.success(res?.data?.message || "User logged in successfully!");
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Client -> Failed to login!");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: () => {
        // 1️⃣ Remove token
        localStorage.removeItem("token");

        // 2️⃣ Clear user state
        set({ authUser: null });

        // 3️⃣ Disconnect socket
        get().disconnectSocket();

        // 4️⃣ Optional feedback
        toast.success("Logged out successfully!");
    },


    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/updateProfile", data);
            if (res?.data?.success) {
                console.log(res?.data);
                toast.success(res?.data?.message || "Image Updated successfully!");
                set({ authUser: res?.data });
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }
        });
        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        })
    },
    disconnectSocket: () => {
        if (get().socket?.connected) {
            get().socket.disconnect();
        }
    },


}));