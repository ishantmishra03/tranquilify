const moodLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, required: true, default: Date.now },
  mood: { type: Number, min: 1, max: 5 },
  energy: { type: Number, min: 1, max: 5 },
  stress: { type: Number, min: 1, max: 5 },
}, {
  timestamps: true
});

export default mongoose.model('MoodLog', moodLogSchema);
