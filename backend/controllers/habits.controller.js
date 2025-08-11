import Habit from '../models/habit.models.js';

 
const isToday = (someDate) => {
  const today = new Date();
  return someDate.getFullYear() === today.getFullYear() &&
         someDate.getMonth() === today.getMonth() &&
         someDate.getDate() === today.getDate();
};

const calculateStreak = (completionDates) => {
  if (!completionDates.length) return 0;

  
  const dateSet = new Set(completionDates.map(date => new Date(date).toDateString()));

  let streak = 0;
  let day = new Date(); 


  while (dateSet.has(day.toDateString())) {
    streak++;
    day.setDate(day.getDate() - 1); 
  }

  return streak;
};

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

export const toggleHabitCompletion = async (req, res) => {
  try {
    const { id } = req.params;
    const habit = await Habit.findOne({ _id: id, user: req.userId });

    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    
    const hasCompletedToday = habit.completions.some(date => isToday(new Date(date)));

    if (hasCompletedToday) {
     
      return res.status(400).json({ success: false, message: 'Habit already completed today' });
    }

   
    habit.completions.push(new Date());

    
    habit.streak = calculateStreak(habit.completions);

    await habit.save();

    res.json({ success: true, habit, message: 'Habit marked as completed for today' });
  } catch (error) {
    console.error('Error toggling habit completion:', error);
    res.status(500).json({ success: false, message: 'Server error toggling habit completion' });
  }
};

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
