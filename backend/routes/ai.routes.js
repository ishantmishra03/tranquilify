import express from 'express';
import {protect} from '../middlewares/auth.middleware.js';
import {suggestCoping, aiTherapistChat, selfCarePlan, journalPrompt, getDailyQuotes} from '../controllers/ai.controller.js';

const aiRouter = express.Router();

aiRouter.post('/suggest-coping', protect,  suggestCoping);
aiRouter.post('/chat', protect, aiTherapistChat);
aiRouter.post('/self-care-plan', protect,selfCarePlan);
aiRouter.post('/journal-prompt', protect,journalPrompt);
aiRouter.get('/daily-quotes', protect,getDailyQuotes);

export default aiRouter;
