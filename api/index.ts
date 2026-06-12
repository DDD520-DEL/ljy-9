import express from 'express';
import cors from 'cors';
import cartridgeRoutes from './routes/cartridges';
import achievementRoutes from './routes/achievements';
import exchangeRoutes from './routes/exchange';
import statsRoutes from './routes/stats';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/cartridges', cartridgeRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/exchange', exchangeRoutes);
app.use('/api/stats', statsRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`API server is running on http://localhost:${PORT}`);
});
