import express from 'express';
const adminRouter = express.Router();
import { verifyAdmin } from '../middlewares/admin.middleware.js';
import { loginAdmin, logoutAdmin } from '../controllers/admin.controller.js';

adminRouter.post('/', loginAdmin);
adminRouter.post('/logout', verifyAdmin, logoutAdmin);

export default adminRouter;