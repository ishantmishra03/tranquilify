import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


import MoodLog from './models/mood.models.js';
import StressAssessment from './models/stress.models.js';

import connectDB from './config/db.config.js';
await connectDB();

import authRouter from './routes/auth.routes.js';
import stressRouter from './routes/stress.routes.js';
import habitRouter from './routes/habit.routes.js';
import userRouter from './routes/user.routes.js';
import moodRouter from './routes/mood.routes.js';
import pdfRouter from './routes/pdf.routes.js';
import journalRouter from './routes/journal.routes.js';
import blogRouter from './routes/blog.routes.js';
import aiRouter from './routes/ai.routes.js';

import adminRouter from './routes/admin.routes.js';
import resetRouter from './routes/reset.routes.js';

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [];


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
app.use('/api/mood', moodRouter);
app.use('/api/pdf', pdfRouter);
app.use('/api/journal', journalRouter);
app.use('/api/blog', blogRouter);
app.use('/api/ai', aiRouter);

//Admin
app.use('/api/admin', adminRouter);

//Reset App
app.use('/api/reset', resetRouter);

app.get('/', (req, res) => {
  res.send('SERVER WORKING !');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
