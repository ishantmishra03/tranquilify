import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.config.js';
await connectDB();

import authRouter from './routes/auth.routes.js';
import stressRouter from './routes/stress.routes.js';
import habitRouter from './routes/habit.routes.js';
import userRouter from './routes/user.routes.js';
import aiRouter from './routes/ai.routes.js';

const app = express();

const allowedOrigins = ['http://localhost:5173',]

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
   credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/stress', stressRouter);
app.use('/api/habits', habitRouter);
app.use('/api/user', userRouter);
app.use('/api/ai', aiRouter);

app.get('/', (req, res) => {
  res.send('SERVER WORKING !');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
