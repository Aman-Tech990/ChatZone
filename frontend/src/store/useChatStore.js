import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/message/users");
            if (res?.data?.success) {
                console.log("Users fetched:", res.data.users);
                set({ users: res.data.users });
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to fetch users!");
        } finally {
            set({ isUsersLoading: false });
        }
    },


    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            if (res?.data?.success) {
                console.log(res.data);
                set({ messages: res.data?.messages });
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to fetch messages!");
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            if (res?.data?.success) {
                console.log(res?.data);
                set({ messages: [...messages, res.data.message] });
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to send messages!");
        }
    },

    // On hold (not completed!)
    setSelectedUser: (selectedUser) => set({ selectedUser: selectedUser }),

}));