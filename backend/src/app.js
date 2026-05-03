const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const expenseRoutes = require('./routes/expenseRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const limitRoutes = require('./routes/limitRoutes');
const fuelRoutes = require('./routes/fuelRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const lendRoutes = require('./routes/lendRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const savingsRoutes = require('./routes/savingsRoutes');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://expance-tracker-frontend-7gsk64oei.vercel.app',
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean) : []),
];

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.send('API is running \uD83D\uDE80');
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Finance tracker API is running' });
});

app.use('/api/expenses', expenseRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/limit', limitRoutes);
app.use('/api/fuel', fuelRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/lend', lendRoutes);

app.use('/api/savings', savingsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
