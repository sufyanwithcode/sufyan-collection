require('dotenv').config();
const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
const client     = require('prom-client');

const authRoutes     = require('./routes/authRoutes');
const productRoutes  = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes    = require('./routes/orderRoutes');
const userRoutes     = require('./routes/userRoutes');

const app = express();

/* ─── Prometheus metrics ───────────────────────────────────── */
client.collectDefaultMetrics({ timeout: 5000 });

const httpDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status'],
});
const httpTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

/* ─── Core middleware ─────────────────────────────────────── */
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

/* ─── Metrics middleware ──────────────────────────────────── */
app.use((req, res, next) => {
  const end = httpDuration.startTimer();
  res.on('finish', () => {
    const labels = { method: req.method, route: req.route?.path || req.path, status: res.statusCode };
    end(labels);
    httpTotal.inc(labels);
  });
  next();
});

/* ─── Static uploads ─────────────────────────────────────── */
app.use('/uploads', express.static('uploads'));

/* ─── Health & metrics ───────────────────────────────────── */
app.get('/health', (_req, res) => res.json({
  status: 'OK',
  service: 'Sufyan Collection API',
  version: '1.0.0',
  timestamp: new Date().toISOString(),
  uptime: process.uptime(),
  database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
}));

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

/* ─── API routes ─────────────────────────────────────────── */
app.use('/api/auth',       authRoutes);
app.use('/api/products',   productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders',     orderRoutes);
app.use('/api/users',      userRoutes);

app.get('/', (_req, res) =>
  res.json({ message: 'Welcome to Sufyan Collection API', version: '1.0.0' }));

/* ─── 404 ────────────────────────────────────────────────── */
app.use('*', (_req, res) =>
  res.status(404).json({ success: false, message: 'Route not found' }));

/* ─── Global error handler ───────────────────────────────── */
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

/* ─── DB + start ─────────────────────────────────────────── */
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`✅  MongoDB connected: ${mongoose.connection.host}`);
};

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀  Sufyan Collection API  →  http://localhost:${PORT}`);
      console.log(`📊  Metrics               →  http://localhost:${PORT}/metrics`);
      console.log(`❤️   Health               →  http://localhost:${PORT}/health`);
    });
  })
  .catch(err => { console.error('❌  DB error:', err); process.exit(1); });

module.exports = app;
