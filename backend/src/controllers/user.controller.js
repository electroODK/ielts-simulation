import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';

// controllers/auth.controller.js

export const loginUserController = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required',
        error: true,
        success: false,
      });
    }

    // ищем пользователя
    const user = await User.findOne({ username });

    if (!user) {
      user = await AdminModel.findOne({ username });
      role = 'admin';
    }
    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials',
        error: true,
        success: false,
      });
    }

    // если статус "notest" → не редиректим
    if (user.status === 'notest') {
      return res.status(200).json({
        message: 'User has not passed the test yet',
        error: false,
        success: true,
        data: {
          user: {
            id: user._id,
            username: user.username,
            status: user.status,
          },
          redirect: false, // фронт проверяет этот флаг
        },
      });
    }

    // сверяем пароль
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // защита от брутфорса
      return res.status(401).json({
        message: 'Invalid credentials',
        error: true,
        success: false,
      });
    }

    // генерируем токены
    const accessToken = await generateAccessToken({ id: user._id });
    const refreshToken = await generateRefreshToken({ id: user._id });

    // сохраняем токены в БД
    user.access_token = accessToken;
    user.refresh_token = refreshToken;
    user.last_login_date = new Date();
    await user.save();

    const cookiesOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie('accessToken', accessToken, cookiesOptions);
    res.cookie('refreshToken', refreshToken, cookiesOptions);

    const userResponse = {
      id: user._id,
      username: user.username,
      status: user.status,
      last_login_date: user.last_login_date,
    };

    return res.status(200).json({
      message: 'Login successful',
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: userResponse,
        role: user.role,
        redirect: true,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: true,
      success: false,
    });
  }
};

export const refresh = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ msg: 'No refresh token' });

  try {
    const user = await User.findOne({ where: { refreshToken: token } });
    if (!user) return res.status(403).json({ msg: 'Invalid refresh token' });

    jwt.verify(token, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ msg: 'Invalid refresh token' });

      const accessToken = jwt.sign(
        { id: user.id, username: user.username },
        process.env.ACCESS_SECRET,
        { expiresIn: '15m' }
      );

      res.json({ accessToken });
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(204);

  try {
    const user = await User.findOne({ where: { refreshToken: token } });
    if (!user) return res.sendStatus(204);

    await User.update({ refreshToken: null }, { where: { id: user.id } });
    res.clearCookie('refreshToken');
    res.json({ msg: 'Logged out' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
