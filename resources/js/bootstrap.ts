import axios from "axios";
window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// Setup axios interceptor to add auth token from localStorage or Inertia page props
window.axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("api_token");

    console.log(token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
