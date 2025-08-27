import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ msg: 'Invalid password' });

    // Генерация токенов
    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    await User.update({ refreshToken }, { where: { id: user.id } });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
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
