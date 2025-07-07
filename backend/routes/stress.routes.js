import express from 'express';
import { createStressAssessment, getUserStressAssessments, getUserStressFactors, getStressData } from '../controllers/stress.controller.js';
import { protect } from '../middlewares/auth.middleware.js'; 

const stressRouter = express.Router();

stressRouter.post('/', protect, createStressAssessment);

stressRouter.get('/', protect, getUserStressAssessments);

stressRouter.get('/pattern', protect, getUserStressFactors);

stressRouter.get('/user', protect, getStressData);


export default stressRouter;
