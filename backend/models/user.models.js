import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  streak: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
export default User;
