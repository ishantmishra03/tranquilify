import mongoose from 'mongoose';

const moodLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mood: { type: String, required: true },
}, {
  timestamps: true
});

export default mongoose.model('MoodLog', moodLogSchema);
