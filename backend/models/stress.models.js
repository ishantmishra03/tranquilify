import mongoose from 'mongoose';

const stressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  stressLevel: { type: Number, min: 0, max: 4, required: true },

  stressFactors: [{ type: String }],


  symptoms: [{ type: String }],
  copingStrategies: [{ type: String }],

  notes: { type: String },

  date: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export default mongoose.model('StressAssessment', stressSchema);
