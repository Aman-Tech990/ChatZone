import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://chatzone-oou0.onrender.com/api",
    withCredentials: true
});

