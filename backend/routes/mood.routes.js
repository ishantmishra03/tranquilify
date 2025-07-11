import express from 'express';
const moodRouter = express.Router();
import { protect } from '../middlewares/auth.middleware.js';
import { addNewMoodData, getMoodPattern, getMoodData } from '../controllers/mood.controller.js';

moodRouter.use(protect);

moodRouter.post('/', addNewMoodData);

moodRouter.get('/pattern', getMoodPattern);

moodRouter.get('/user', protect, getMoodData);


export default moodRouter;