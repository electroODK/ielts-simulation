import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { token, role, name }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Загружаем данные из localStorage при старте
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");

    if (token) {
      setUser({ token, role, name });
    }
    setLoading(false);
  }, []);

  const login = (token, role, name) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);

    setUser({ token, role, name });
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");

    setUser(null);
  };

  const isLoggedIn = !!user;
  const isUser = user?.role === "user";
  const isAdmin = user?.role === "admin";
  const isSpeakingChecker = user?.role === "speaking-checker";
  const isWritingChecker = user?.role === "writing-checker";

  const value = {
    user,
    isLoggedIn,
    isUser,
    isAdmin,
    isSpeakingChecker,
    isWritingChecker,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
