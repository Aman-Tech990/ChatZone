import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/checkAuth");
            set({ authUser: res.data });
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
                set({ authUser: res?.data?.user });
                toast.success(res?.data?.message || "User signed up successfully!");
            }
        } catch (error) {
            toast.error(error.response.data.message || "Failed to register user");
        } finally {
            set({ isSigningUp: false });
        }
    },

    logout: async (data) => {
        try {
            const res = axiosInstance.get("/auth/logout");
            if (res?.data?.success) {
                console.log(res?.data);
                set({ authUser: null });
                toast.success(res?.data?.message || "User logged out successfully!");
            }
        } catch (error) {
            toast.error(error.response.data.message || "Failed to logout!");
        }
    }
}));