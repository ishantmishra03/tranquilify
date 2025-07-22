import express from 'express';
const journalRouter = express.Router();
import { protect } from '../middlewares/auth.middleware.js';
import { createJournal, getJournals, deleteJournal } from '../controllers/journal.controller.js';

journalRouter.post('/', protect, createJournal);
journalRouter.get('/', protect, getJournals);
journalRouter.delete('/:id', protect, deleteJournal);

export default journalRouter;