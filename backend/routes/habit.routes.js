import express from 'express';
import {
  getUserHabits,
  createHabit,
  toggleHabitCompletion,
  deleteHabit,
  getLatestHabits,
} from '../controllers/habits.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const habitRouter = express.Router();

habitRouter.use(protect); // Protect all routes

habitRouter.get('/', getUserHabits);
habitRouter.get('/latest', getLatestHabits);
habitRouter.post('/', createHabit);
habitRouter.patch('/:id/toggle', toggleHabitCompletion);
habitRouter.delete('/:id', deleteHabit);

export default habitRouter;
