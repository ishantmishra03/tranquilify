import express from 'express';
const moodRouter = express.Router();
import { protect } from '../middlewares/auth.middleware.js';
import { addNewMoodData, getMoodPattern, getMoodData, analyzeMood } from '../controllers/mood.controller.js';

moodRouter.use(protect);

moodRouter.post('/', addNewMoodData);

moodRouter.get('/pattern', getMoodPattern);

moodRouter.get('/user', protect, getMoodData);

moodRouter.post('/analyze', protect, analyzeMood);



export default moodRouter;