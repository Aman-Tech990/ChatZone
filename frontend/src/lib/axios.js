import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://chatzone-oou0.onrender.com/api",
});

// 🔐 ADD INTERCEPTOR HERE
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
