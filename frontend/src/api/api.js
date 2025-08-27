import axios from "axios";

const API_URL = "http://localhost:1488/api"; // адрес бэкенда

// 🔧 экземпляр axios
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // если используешь cookies
});

// ⬆️ interceptor для accessToken
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔄 interceptor для обновления токена
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await api.put("/auth/refresh-token", {
          refreshToken: localStorage.getItem("refresh_token"),
        });

        localStorage.setItem("access_token", data.accessToken);
        localStorage.setItem("refresh_token", data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error("❌ Ошибка обновления токена:", err);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/"; // редирект на логин
      }
    }

    return Promise.reject(error);
  }
);

//
// ======================
// 🔑 AUTH
// ======================
// 👤 User login (без регистрации)
export const loginUser = async (username, password) => {
  const { data } = await api.post("/api/auth/login", { username, password });
  localStorage.setItem("access_token", data.accessToken);
  localStorage.setItem("refresh_token", data.refreshToken);
  return data;
};

// 👮 Admin login
export const loginAdmin = async (username, password) => {
  const { data } = await api.post("/auth/admin/login", { username, password });
  localStorage.setItem("access_token", data.accessToken);
  localStorage.setItem("refresh_token", data.refreshToken);
  return data;
};

export const logout = async () => {
  await api.post("/auth/logout");
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const refreshToken = async () => {
  const { data } = await api.put("/auth/refresh-token", {
    refreshToken: localStorage.getItem("refresh_token"),
  });
  localStorage.setItem("access_token", data.accessToken);
  localStorage.setItem("refresh_token", data.refreshToken);
  return data;
};

//
// ======================
// 📚 TESTS
// ======================
// создать тест (сборка из секций)
export const createTest = async (testData) => {
  const { data } = await api.post("/tests", testData);
  return data;
};

// получить список всех тестов
export const getTests = async () => {
  const { data } = await api.get("/tests");
  return data;
};

// получить конкретный тест (+ populate секции)
export const getTestById = async (id) => {
  const { data } = await api.get(`/tests/${id}`);
  return data;
};

// назначить тест юзеру
export const assignTestToUser = async (userId, testId) => {
  const { data } = await api.post(`/tests/assign`, { userId, testId });
  return data;
};

//
// ======================
// 🧑 USERS
// ======================
// создать юзера (только админ)
export const createUser = async (userData) => {
  const { data } = await api.post("/users", userData);
  return data;
};

// получить список юзеров
export const getUsers = async () => {
  const { data } = await api.get("/users");
  return data;
};

// получить инфо о юзере
export const getUserById = async (id) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

//
// ======================
// 📊 RESULTS
// ======================
// отправить ответы (юзер)
export const submitResult = async (resultData) => {
  const { data } = await api.post("/results/submit", resultData);
  return data;
};

// получить результаты юзера
export const getUserResults = async (userId) => {
  const { data } = await api.get(`/results/user/${userId}`);
  return data;
};


// получить все результаты (админ)
export const getAllResults = async () => {
   const { data } = await api.get("/results");
   return data;
 };
 
 // обновить результат (оценка/фидбек)
 export const updateResult = async (id, updateData) => {
   const { data } = await api.patch(`/results/${id}`, updateData);
   return data;
 };
 
 export default api;
 