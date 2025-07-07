import express from 'express';
import { createStressAssessment, getUserStressAssessments } from '../controllers/stress.controller.js';
import { protect } from '../middlewares/auth.middleware.js'; 

const stressRouter = express.Router();

stressRouter.post('/', protect, createStressAssessment);

stressRouter.get('/', protect, getUserStressAssessments);


export default stressRouter;
