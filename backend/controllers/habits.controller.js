import Habit from '../models/habit.models.js';

// Helper to check if a date is today (ignoring time)
const isToday = (someDate) => {
  const today = new Date();
  return someDate.getFullYear() === today.getFullYear() &&
         someDate.getMonth() === today.getMonth() &&
         someDate.getDate() === today.getDate();
};

// Calculate streak of consecutive days from sorted completion dates (descending)
const calculateStreak = (dates) => {
  if (!dates.length) return 0;

  // Sort descending
  dates.sort((a, b) => b - a);

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const diffDays = Math.floor((dates[i - 1] - dates[i]) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) streak++;
    else break;
  }
  return streak;
};

// Get all habits for the logged-in user
export const getUserHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, habits });
  } catch (error) {
    console.error('Error fetching habits:', error);
    res.status(500).json({ success: false, message: 'Server error fetching habits' });
  }
};

export const getLatestHabits = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const habits = await Habit.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json({ success: true, habits });
  } catch (error) {
    console.error('Error fetching latest habits:', error);
    res.status(500).json({ success: false, message: 'Server error fetching latest habits' });
  }
};

// Create a new habit
export const createHabit = async (req, res) => {
  try {
    const { name, icon, color } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Habit name is required' });
    }

    const newHabit = new Habit({
      user: req.userId,
      name,
      icon: icon || '🎯',
      color: color || 'blue',
      completions: [], 
      streak: 0,
    });

    await newHabit.save();
    res.status(201).json({ success: true, habit: newHabit, message: 'Habit created' });
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(500).json({ success: false, message: 'Server error creating habit' });
  }
};

// Toggle habit completion for today (add completion date if not completed today, reject if already done)
export const toggleHabitCompletion = async (req, res) => {
  try {
    const { id } = req.params;
    const habit = await Habit.findOne({ _id: id, user: req.userId });

    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    // Check if completed today
    const hasCompletedToday = habit.completions.some(date => isToday(new Date(date)));

    if (hasCompletedToday) {
      // Reject multiple completions on the same day
      return res.status(400).json({ success: false, message: 'Habit already completed today' });
    }

    // Add today's completion date
    habit.completions.push(new Date());

    // Calculate updated streak
    habit.streak = calculateStreak(habit.completions);

    await habit.save();

    res.json({ success: true, habit, message: 'Habit marked as completed for today' });
  } catch (error) {
    console.error('Error toggling habit completion:', error);
    res.status(500).json({ success: false, message: 'Server error toggling habit completion' });
  }
};

// Delete habit
export const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;

    const habit = await Habit.findOneAndDelete({ _id: id, user: req.userId });

    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    res.json({ success: true, message: 'Habit deleted' });
  } catch (error) {
    console.error('Error deleting habit:', error);
    res.status(500).json({ success: false, message: 'Server error deleting habit' });
  }
};
