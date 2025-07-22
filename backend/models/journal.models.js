import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
}, { timestamps: true });

const Journal = mongoose.model('Journal', journalSchema);

export default Journal;