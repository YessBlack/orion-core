import axios from "axios"

const baseURL = import.meta.env.VITE_API_BASE_URL

if (!baseURL) {
  throw new Error("Missing VITE_API_BASE_URL environment variable")
}

export const authApiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})
