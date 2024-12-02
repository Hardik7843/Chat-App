import axios from 'axios'
import config from 'dotenv'


export const AXIOS = axios.create({
    baseURL: import.meta.env.MODE === "development" ? import.meta.env.VITE_BASE_URL : "/api",
    withCredentials: true
})