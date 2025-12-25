import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const userAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckAuthUser: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/checkAuth");
            set({ authUser: res.data });
        } catch (error) {
            console.log("Error in CheckAuth: ", error);
            set({ authUser: null });
        } finally {
            set({ isCheckAuthUser: false });
        }
    }

}));