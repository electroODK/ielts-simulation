import { Router } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const authRouter = Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'dev';

authRouter.post('/login-user', async (req, res) => {
  const { username } = req.body || {};
  if (!username || typeof username !== 'string') return res.status(400).json({ message: 'username required' });
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || user.role !== Role.user) return res.status(404).json({ message: 'Пользователь не найден. Обратитесь к администратору' });
  // set pseudo-session cookie (stateless, but ok)
  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('session', token, { httpOnly: true, sameSite: 'lax' });
  return res.json({ ok: true });
});

authRouter.post('/login-admin', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ message: 'username and password required' });
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || user.role !== Role.admin || !user.passwordHash) return res.status(401).json({ message: 'Unauthorized' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Unauthorized' });
  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
  res.cookie('admin_jwt', token, { httpOnly: true, sameSite: 'lax' });
  return res.json({ ok: true });
});

authRouter.post('/logout', async (_req, res) => {
  res.clearCookie('session');
  res.clearCookie('admin_jwt');
  return res.status(204).send();
});