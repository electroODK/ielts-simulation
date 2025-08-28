// src/pages/Login.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components/Auth.module.css";
import OpenEye from "../assets/photo_2025-08-26_16-50-52.jpg";
import CloseEye from "../assets/photo_2025-08-26_16-51-10.jpg";
import { loginUser as loginApi } from "../api/api.js";
import { useAuth } from "../components/AuthContext";

const Login = () => {
  const { login } = useAuth(); // ⚡️ берём login из AuthContext
  const navigate = useNavigate();

  const [username, setUsername] = useState(""); // теперь username
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // ⚡️ отправляем username + password
      const res = await loginApi(username, password);
      // console.log("успех", res);

      const { accessToken, refreshToken, user, role, redirect } = res;

      // сохраняем токены
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      // обновляем глобальный AuthContext
      login(accessToken, role);

      // role-based redirect
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "speaking-checker") {
        navigate("/checker/speaking");
      } else if (role === "writing-checker") {
        navigate("/checker/writing");
      } else if (role === "user") {
        navigate(`/exam/start/${user?.id || 'start'}`);
      } else {
        // notest: остаёмся на странице или показываем уведомление
      }
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка входа");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.fullPageWrapper}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Вход</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Username вместо Email */}
          <div className={styles.formGroup}>
            <label>Имя пользователя*</label>
            <input
              type="text"
              placeholder="Введите уникальный username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Пароль*</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eyeButton}
              >
                <img
                  src={showPassword ? OpenEye : CloseEye}
                  alt="Toggle password visibility"
                />
              </button>
            </div>
          </div>

          {error && (
            <p style={{ color: "red", textAlign: "center" }}>{error}</p>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Входим..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
