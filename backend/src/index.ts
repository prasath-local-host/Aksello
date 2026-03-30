import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import taskRoutes from './routes/tasks';

const app = express();
const PORT = process.env.PORT || 4000;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
