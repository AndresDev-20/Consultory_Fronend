import axios from "axios";

export const TOKEN_KEY = "token";
export const USER_KEY = "user";

const client = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_URL,
});

// Adjunta el token a cada petición
client.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Si el token venció, cerramos la sesión y avisamos a la app
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLogin = error.config?.url?.includes("/users/login");
    if (error.response?.status === 401 && !isLogin) {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      window.dispatchEvent(new Event("auth:expired"));
    }
    return Promise.reject(error);
  },
);

export default client;
