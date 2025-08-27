import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, name, role, token }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Загружаем данные из localStorage при старте
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");

    if (token) {
      setUser({ token, role, name });
    }
    setLoading(false);
  }, []);

  const login = (token, role, name) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);

    setUser({ token, role, name });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    localStorage.removeItem("name");

    setUser(null);
  };

  const isLoggedIn = !!user;
  const isStudent = user?.role === "student";
  const isTeacher = user?.role === "teacher";
  const isAdmin = user?.role === "admin";

  const value = {
    user,
    isLoggedIn,
    isStudent,
    isTeacher,
    isAdmin,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
