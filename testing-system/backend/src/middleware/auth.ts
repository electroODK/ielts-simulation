import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev';

export interface AuthedRequest extends Request {
  admin?: { sub: string; role: string } | null;
  session?: { sub: string; role: string } | null;
}

export function adminOnly(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.admin_jwt;
    if (!token) return res.status(401).json({ message: 'Admin auth required' });
    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (!payload || payload.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    req.admin = { sub: payload.sub, role: payload.role };
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid admin token' });
  }
}

export function userSession(req: AuthedRequest, _res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.session;
    if (token) {
      const payload = jwt.verify(token, JWT_SECRET) as any;
      req.session = { sub: payload.sub, role: payload.role };
    }
  } catch {
    req.session = null;
  }
  return next();
}