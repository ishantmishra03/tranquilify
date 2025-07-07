const weeklyStatsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  weekStart: Date,
  averageMood: Number,
  averageStress: Number,
  averageEnergy: Number,
  moodImprovement: Number,
  stressReduction: Number,
  energyIncrease: Number
}, {
  timestamps: true
});

export default mongoose.model('WeeklyStats', weeklyStatsSchema);
