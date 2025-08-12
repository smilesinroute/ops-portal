import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JwtUser } from '../types';

const router = Router();

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

router.post('/login', async (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });
  const { email, password } = parsed.data;

  // Fetch user
  const { rows } = await query<{ id: string; email: string; password_hash: string; role: string; full_name: string }>(
    'select id, email, password_hash, role, full_name from users where email = $1',
    [email.toLowerCase()]
  );
  const user = rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const payload: JwtUser = { id: user.id, email: user.email, role: user.role as any, full_name: user.full_name };
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '12h' });
  return res.json({ token });
});

export default router;