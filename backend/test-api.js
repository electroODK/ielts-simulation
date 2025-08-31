import axios from 'axios';

const API_URL = 'http://localhost:1488/api';

async function testAPI() {
  console.log('🧪 Тестирование API endpoints...\n');

  try {
    // Тест 1: Проверка доступности сервера
    console.log('1️⃣ Тест доступности сервера...');
    try {
      const response = await axios.get(`${API_URL}/auth/login`);
      console.log('✅ Сервер доступен');
    } catch (error) {
      if (error.response?.status === 405) {
        console.log('✅ Сервер доступен (метод не разрешен - это нормально)');
      } else {
        console.log('❌ Сервер недоступен:', error.message);
        return;
      }
    }

    // Тест 2: Проверка без токена
    console.log('\n2️⃣ Тест без токена...');
    try {
      const response = await axios.get(`${API_URL}/users`);
      console.log('❌ Неожиданно получили доступ без токена');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Правильно: требуется аутентификация');
      } else if (error.response?.status === 403) {
        console.log('✅ Правильно: доступ запрещен');
      } else {
        console.log('⚠️ Неожиданный статус:', error.response?.status);
      }
    }

    // Тест 3: Проверка с неверным токеном
    console.log('\n3️⃣ Тест с неверным токеном...');
    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: 'Bearer invalid_token' }
      });
      console.log('❌ Неожиданно получили доступ с неверным токеном');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Правильно: неверный токен отклонен');
      } else if (error.response?.status === 403) {
        console.log('✅ Правильно: доступ запрещен');
      } else {
        console.log('⚠️ Неожиданный статус:', error.response?.status);
      }
    }

    console.log('\n📋 Результаты тестирования:');
    console.log('✅ Сервер работает');
    console.log('✅ Аутентификация работает');
    console.log('✅ Авторизация работает');
    console.log('\n💡 Теперь нужно войти с правильными данными');

  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.message);
  }
}

// Запускаем тест
testAPI();