import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";

// controllers/auth.controller.js


export const loginUserController = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      return res.status(400).json({
        message: "Username is required",
        error: true,
        success: false,
      });
    }

    // ищем пользователя
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
        error: true,
        success: false,
      });
    }

    // Политика: для admin/checkers пароль обязателен; для user пароль опционален
    const isPrivileged = ["admin", "speaking-checker", "writing-checker"].includes(user.role);
    if (isPrivileged) {
      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return res.status(401).json({ message: "Invalid credentials", error: true, success: false });
      }
    } else {
      if (password) {
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          return res.status(401).json({ message: "Invalid credentials", error: true, success: false });
        }
      }
    }

    // генерируем токены
    const accessToken = generateAccessToken({ id: user._id, role: user.role, username: user.username });
    const refreshToken = generateRefreshToken({ id: user._id, role: user.role, username: user.username });

    // сохраняем токены в БД
    user.access_token = accessToken;
    user.refresh_token = refreshToken;
    user.last_login_date = new Date();
    await user.save();

    const cookiesOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("accessToken", accessToken, cookiesOptions);
    res.cookie("refreshToken", refreshToken, cookiesOptions);

    const userResponse = {
      id: user._id,
      username: user.username,
      status: user.status,
      role: user.role,
      last_login_date: user.last_login_date,
    };

    return res.status(200).json({
      message: "Login successful",
      error: false,
      success: true,
      accessToken,
      refreshToken,
      user: userResponse,
      role: user.role,
      redirect: true,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
};

export const loginAdminController = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken({ id: user._id, role: user.role, username: user.username });
    const refreshToken = generateRefreshToken({ id: user._id, role: user.role, username: user.username });

    user.access_token = accessToken;
    user.refresh_token = refreshToken;
    user.last_login_date = new Date();
    await user.save();

    const shouldRedirect = user.status !== "notest";
    return res.status(200).json({
      accessToken,
      refreshToken,
      user: { id: user._id, username: user.username, role: user.role, status: user.status },
      role: user.role,
      redirect: shouldRedirect,
      message: shouldRedirect ? "Login successful" : "User has not passed the test yet",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

  const user = await User.findOne({ refresh_token: refreshToken });
  if (!user) return res.status(403).json({ message: 'Invalid refresh token' });

  try {
    verifyRefreshToken(refreshToken);
  } catch {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }

  const newAccessToken = generateAccessToken({ id: user._id, role: user.role, username: user.username });
  const newRefreshToken = generateRefreshToken({ id: user._id, role: user.role, username: user.username });
  user.access_token = newAccessToken;
  user.refresh_token = newRefreshToken;
  await user.save();
  return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
};

export const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return res.sendStatus(204);

    const user = await User.findOne({ access_token: token });
    if (!user) return res.sendStatus(204);

    user.access_token = "";
    user.refresh_token = "";
    await user.save();
    return res.json({ message: 'Logged out' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};
