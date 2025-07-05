import express from 'express';
const authRouter = express.Router();
import { protect } from '../middlewares/auth.middleware.js';
import { signup, login, logout, isAuthenticated } from '../controllers/auth.controller.js';

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/logout', protect, logout);
authRouter.post('/isAuth', protect, isAuthenticated);

export default authRouter;