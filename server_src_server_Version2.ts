import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import orderRoutes from './routes/orders';

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? true, credentials: false }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api', orderRoutes);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`Ops backend listening on http://localhost:${port}`);
});