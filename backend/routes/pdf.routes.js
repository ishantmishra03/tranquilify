import express from 'express';
const pdfRouter = express.Router();
import { protect } from '../middlewares/auth.middleware.js';
import { generateMentalHealthPDF } from '../controllers/pdf.controller.js';

pdfRouter.get('/', protect, generateMentalHealthPDF);


export default pdfRouter;