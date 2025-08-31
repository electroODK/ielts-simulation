import axios from 'axios';

const API_URL = 'http://localhost:1488/api'; // адрес бэкенда

// 🔧 экземпляр axios
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// ⬆️ interceptor для accessToken
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
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
    const isRefreshCall = originalRequest?.url?.includes('/auth/refresh-token');
    const hasRt = !!localStorage.getItem('refresh_token');
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshCall &&
      hasRt
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await api.put('/auth/refresh-token', {
          refreshToken: localStorage.getItem('refresh_token'),
        });

        localStorage.setItem('access_token', data.accessToken);
        localStorage.setItem('refresh_token', data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error('❌ Ошибка обновления токена:', err);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        if (!isRefreshCall) window.location.href = '/'; // редирект на логин
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
  const payload = { username };
  if (password) payload.password = password;
  const { data } = await api.post('/auth/login', payload);
  localStorage.setItem('access_token', data.accessToken);
  localStorage.setItem('refresh_token', data.refreshToken);
  return data;
};

// 👮 Admin login
export const loginAdmin = async (username, password) => {
  const { data } = await api.post('/auth/admin/login', { username, password });
  localStorage.setItem('access_token', data.accessToken);
  localStorage.setItem('refresh_token', data.refreshToken);
  return data;
};

export const logout = async () => {
  await api.post('/auth/logout');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const refreshToken = async () => {
  const { data } = await api.put('/auth/refresh-token', {
    refreshToken: localStorage.getItem('refresh_token'),
  });
  localStorage.setItem('access_token', data.accessToken);
  localStorage.setItem('refresh_token', data.refreshToken);
  return data;
};

//
// ======================
// 📚 TESTS
// ======================
// создать тест (сборка из секций)
export const createTest = async (testData) => {
  const { data } = await api.post('/tests', testData);
  return data;
};

// получить список всех тестов
export const getTests = async () => {
  try {
    const { data } = await api.get("/tests");
    return data;
  } catch (error) {
    if (error.response?.status === 403) {
      console.warn('Access denied: User not authorized to view tests');
      return [];
    }
    throw error;
  }
};

// получить конкретный тест (+ populate секции)
export const getTestById = async (id) => {
  const { data } = await api.get(`/tests/${id}`);
  return data;
};

export const getListeningTestPublic = async (id) => {
  const { data } = await api.get(`/tests/${id}/public`);
  return data;
};

export const getReadingTestPublic = async (id) => {
  const { data } = await api.get(`/tests/${id}/public`);
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
  const { data } = await api.post('/users', userData);
  return data;
};

// получить список юзеров
export const getUsers = async () => {
  try {
    const { data } = await api.get("/users");
    return data;
  } catch (error) {
    if (error.response?.status === 403) {
      console.warn('Access denied: User not authorized to view users list');
      return [];
    }
    throw error;
  }
};

// получить инфо о юзере
export const getUserById = async (id) => {
  try {
    const { data } = await api.get(`/users/${id}`);
    return data;
  } catch (error) {
    if (error.response?.status === 403) {
      console.warn('Access denied: User not authorized to view user details');
      return null;
    }
    throw error;
  }
};

//
// ======================
// 📊 RESULTS
// ======================
// отправить ответы (юзер)
export const submitResult = async (resultData) => {
  const { data } = await api.post('/results/submit', resultData);
  return data;
};

export const submitListening = async (payload) => {
  const { data } = await api.post('/results/submit-listening', payload);
  return data;
};

export const submitReading = async (payload) => {
  const { data } = await api.post('/results/submit-reading', payload);
  return data;
};

export const submitWriting = async (payload) => {
  const { data } = await api.post('/results/submit-writing', payload);
  return data;
};

export const uploadSpeakingRecording = async (formData) => {
  const { data } = await api.post('/speaking/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// ======================
// ASSIGNMENTS (admin + user)
// ======================
export const createAssignment = async ({
  userId,
  listeningTestId,
  readingTestId,
  writingTestId,
  speakingTestId,
}) => {
  const { data } = await api.post('/assignments', {
    userId,
    listeningTestId,
    readingTestId,
    writingTestId,
    speakingTestId,
  });
  return data;
};

export const listAssignments = async () => {
  try {
    const { data } = await api.get("/assignments");
    return data;
  } catch (error) {
    if (error.response?.status === 403) {
      console.warn('Access denied: User not authorized to view assignments');
      return [];
    }
    throw error;
  }
};

export const getMyAssignment = async () => {
  const { data } = await api.get('/assignments/me');
  return data;
};

// получить результаты юзера
export const getUserResults = async (userId) => {
  const { data } = await api.get(`/results/user/${userId}`);
  return data;
};

// получить все результаты (админ)
export const getAllResults = async () => {
   try {
     const { data } = await api.get("/results");
     return data;
   } catch (error) {
     if (error.response?.status === 403) {
       console.warn('Access denied: User not authorized to view results');
       return [];
     }
     throw error;
   }
 };
 
 // обновить результат (оценка/фидбек)
 export const updateResult = async (id, updateData) => {
   const { data } = await api.patch(`/results/${id}`, updateData);
   return data;
 };
 
 // финализировать результат
 export const finalizeResult = async (id) => {
   const { data } = await api.post(`/results/${id}/finalize`);
   return data;
 };
 
 // опубликовать результат
 export const publishResult = async (id) => {
  const { data } = await api.post(`/results/${id}/publish`);
  return data;
};

// ======================
// 🤖 AI TRAI
// ======================
export const checkWritingWithTRAI = async (task1Text, task2Text, taskType = "both") => {
  const { data } = await api.post('/ai/check-writing', {
    task1Text,
    task2Text,
    taskType
  });
  return data;
};

export default api;
 
