import Habit from '../models/habit.models.js';
import StressAssessment from '../models/stress.models.js';
import MoodLog from '../models/mood.models.js';
import Journal from '../models/journal.models.js';
import User from '../models/user.models.js';

export const resetUserData = async (req, res) => {
  try {
    const userId = req.userId; 

    await Promise.all([
      Habit.deleteMany({ user: userId }),
      StressAssessment.deleteMany({ user: userId }),
      MoodLog.deleteMany({ user: userId }),
      Journal.deleteMany({ user: userId }),
    ]);

    res.status(200).json({ success: true, message: 'User data reset successfully.' });
  } catch (error) {
    console.error('Error resetting user data:', error);
    res.status(500).json({ success: false, message: 'Failed to reset user data.' });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;

    await Promise.all([
      Habit.deleteMany({ user: userId }),
      StressAssessment.deleteMany({ user: userId }),
      MoodLog.deleteMany({ user: userId }),
      Journal.deleteMany({ user: userId }),
      User.findByIdAndDelete(userId),
    ]);

   
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      sameSite: "Lax",
    });

    res.status(200).json({ success: true, message: "Account deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete account." });
  }
};
