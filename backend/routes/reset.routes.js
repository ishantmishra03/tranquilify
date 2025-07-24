import express from 'express';
const resetRouter = express.Router();
import { protect } from '../middlewares/auth.middleware.js';
import { resetUserData, deleteAccount } from '../controllers/reset.controller.js';

resetRouter.get('/', protect, resetUserData);
resetRouter.delete('/delete', protect, deleteAccount);

export default resetRouter;