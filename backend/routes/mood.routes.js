import express from 'express';
const moodRouter = express.Router();
import { protect } from '../middlewares/auth.middleware.js';
import { addNewMoodData } from '../controllers/mood.controller.js';

moodRouter.use(protect);

moodRouter.post('/', addNewMoodData);


export default moodRouter;