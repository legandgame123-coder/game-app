import axios from "axios";
import { jwtDecode } from 'jwt-decode'; // ✅ correct named import

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("accessToken");

  // Check if expired
  if (token && isTokenExpired(token)) {
    const refreshed = await refreshAccessToken();
    if (refreshed) token = refreshed;
  }

  if (token) {
    config.headers.Authorization = `${token}`;
  }

  return config;
});

export default axiosInstance;

// Helper function
function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
}

// Refresh Function
async function refreshAccessToken() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await response.json();
    const { accessToken } = data.data;
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (err) {
    console.error("Failed to refresh token:", err);
    return null;
  }
}
