import axios from "axios";

const API_URL = "http://localhost:8080"; // URL вашего бэкенда

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// Перехватчик для обработки ответов
api.interceptors.response.use(
  (response) => {
    // Если запрос успешный, просто возвращаем ответ
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Проверяем URL запроса
      const requestUrl = error.config.url;
      // Если ошибка НЕ возникает на эндпоинтах авторизации или регистрации,
      // тогда выполняем перенаправление
      if (!requestUrl.includes("/login") && !requestUrl.includes("/register")) {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Регистрация пользователя
export const registerUser = async (userData) => {
  const response = await api.post("/register", userData);
  return response.data;
};

// Авторизация пользователя
export const loginUser = async (credentials) => {
  const response = await api.post("/login", credentials);
  return response.data;
};

// Доступ к защищенному маршруту
export const getProtectedData = async (token) => {
  const response = await api.get("/protected", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get("profile", {
    headers: { Authorization: token },
  });
  return response.data;
};

export const updateProfile = async (profileData) => {
  const token = localStorage.getItem("token");
  const response = await api.put("profile", profileData, {
    headers: { Authorization: token },
  });
  return response.data;
};

export const searchUsers = async (filters, currentPage, limit = 20) => {
  const token = localStorage.getItem("token"); // Получаем токен из localStorage
  const response = await api.get("/search", {
    params: {
      ...filters,
      limit,
      offset: (currentPage - 1) * limit,
    },
    headers: { Authorization: token }, // Добавляем токен в заголовок
  });
  return response.data; // Возвращает { total: number, users: [] }
};

export const getUserProfile = async (userId) => {
  const token = localStorage.getItem("token"); // Получаем токен
  const response = await api.get(`/profile/${userId}`, {
    headers: { Authorization: token }, // Добавляем токен в заголовок
  });
  return response.data;
};

export const getMessages = async () => {
  const token = localStorage.getItem("token"); // Получаем токен
  const response = await api.get("/messages", {
    headers: { Authorization: token },
  });
  return response.data;
};

export const getChatHistory = async (userId) => {
  const token = localStorage.getItem("token");
  const response = await api.get(`/chat/${userId}`, {
    headers: { Authorization: token },
  });
  return response.data;
};