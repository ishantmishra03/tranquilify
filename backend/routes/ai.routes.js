import express from 'express';
import * as aiController from '../controllers/ai.controller.js';

const aiRouter = express.Router();

aiRouter.post('/suggest-coping', aiController.suggestCoping);
aiRouter.post('/chat', aiController.aiTherapistChat);
aiRouter.post('/self-care-plan', aiController.selfCarePlan);
aiRouter.post('/journal-prompt', aiController.journalPrompt);
aiRouter.get('/daily-quotes', aiController.getDailyQuotes);

export default aiRouter;
