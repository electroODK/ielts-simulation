import { Router } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import { adminOnly } from '../middleware/auth';
import bcrypt from 'bcrypt';

export const usersRouter = Router();
const prisma = new PrismaClient();

usersRouter.get('/', adminOnly, async (_req, res) => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  return res.json(users);
});

usersRouter.post('/', adminOnly, async (req, res) => {
  const { username, role, password } = req.body || {};
  if (!username || !role) return res.status(400).json({ message: 'username and role required' });
  if (role === 'admin' && !password) return res.status(400).json({ message: 'password required for admin' });
  try {
    const passwordHash = role === 'admin' ? await bcrypt.hash(password, 10) : null;
    const user = await prisma.user.create({ data: { username, role: role as Role, passwordHash: passwordHash ?? undefined } });
    return res.status(201).json(user);
  } catch (e: any) {
    return res.status(400).json({ message: e.message });
  }
});

usersRouter.delete('/:id', adminOnly, async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  } catch (e: any) {
    return res.status(404).json({ message: 'Not found' });
  }
});

usersRouter.get('/:id/assignments', adminOnly, async (req, res) => {
  const items = await prisma.assignment.findMany({ where: { userId: req.params.id }, include: { test: true } });
  return res.json(items);
});