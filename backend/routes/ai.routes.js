import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { getAiTip  } from '../controllers/ai.controller.js';

const aiRouter = express.Router();

aiRouter.get('/', protect, getAiTip);

export default aiRouter;

