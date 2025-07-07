import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { getUserData  } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.get('/', protect, getUserData);

export default userRouter;

