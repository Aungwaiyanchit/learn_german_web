import axios from "axios";
import { attachApiCache } from "./api-cache";

export const api = attachApiCache(
    axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
            "Content-Type": "application/json",
        },
    }),
);
