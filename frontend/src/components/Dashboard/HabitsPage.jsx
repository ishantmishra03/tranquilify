import React, { useEffect, useState } from 'react';
import { Target, Plus, Flame, TrendingUp, CheckCircle, X } from 'lucide-react';
import axios from '../../config/axios'; 
import { toast } from 'react-hot-toast';

const colors = [
  { name: 'blue', class: 'bg-blue-500' },
  { name: 'emerald', class: 'bg-emerald-500' },
  { name: 'purple', class: 'bg-purple-500' },
  { name: 'rose', class: 'bg-rose-500' },
  { name: 'orange', class: 'bg-orange-500' },
  { name: 'indigo', class: 'bg-indigo-500' },
  { name: 'green', class: 'bg-green-500' },
  { name: 'sky', class: 'bg-sky-500' }
];

const icons = ['🎯', '🏃', '📚', '🧘', '💧', '🥗', '😴', '🌱', '💪', '🎨', '🎵', '📝'];

const getColorClass = (color) => {
  const colorMap = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
    green: 'bg-green-500',
    sky: 'bg-sky-500',
    rose: 'bg-rose-500',
    orange: 'bg-orange-500'
  };
  return colorMap[color] || 'bg-gray-500';
};

const getBorderClass = (color) => {
  const colorMap = {
    emerald: 'border-emerald-500',
    blue: 'border-blue-500',
    purple: 'border-purple-500',
    indigo: 'border-indigo-500',
    green: 'border-green-500',
    sky: 'border-sky-500',
    rose: 'border-rose-500',
    orange: 'border-orange-500'
  };
  return colorMap[color] || 'border-gray-500';
};

// Helper: check if date is today (ignores time)
const isToday = (someDate) => {
  const today = new Date();
  const d = new Date(someDate);
  return d.getFullYear() === today.getFullYear() &&
         d.getMonth() === today.getMonth() &&
         d.getDate() === today.getDate();
};

export const HabitsPage = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitIcon, setNewHabitIcon] = useState('🎯');
  const [newHabitColor, setNewHabitColor] = useState('blue');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/habits');
        if (res.data.success) {
          setHabits(res.data.habits);
        } else {
          toast.error('Failed to load habits');
        }
      } catch (error) {
        toast.error('Error fetching habits');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, []);

  const addNewHabit = async () => {
    if (!newHabitName.trim()) return;

    try {
      setSaving(true);
      const res = await axios.post('/api/habits', {
        name: newHabitName.trim(),
        icon: newHabitIcon,
        color: newHabitColor,
      });

      if (res.data.success) {
        setHabits((prev) => [res.data.habit, ...prev]);
        toast.success('Habit added');
        setNewHabitName('');
        setNewHabitIcon('🎯');
        setNewHabitColor('blue');
        setShowAddHabit(false);
      } else {
        toast.error(res.data.message || 'Failed to add habit');
      }
    } catch (error) {
      toast.error('Error adding habit');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // Toggle habit completion for today
  const toggleHabit = async (habitId) => {
    try {
      const res = await axios.patch(`/api/habits/${habitId}/toggle`);
      if (res.data.success) {
        setHabits((prev) =>
          prev.map((h) => (h._id === habitId ? res.data.habit : h))
        );
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || 'Failed to toggle habit');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error toggling habit');
      console.error(error);
    }
  };

  const deleteHabit = async (habitId) => {
    if (!window.confirm('Delete this habit?')) return;

    try {
      const res = await axios.delete(`/api/habits/${habitId}`);
      if (res.data.success) {
        setHabits((prev) => prev.filter((h) => h._id !== habitId));
        toast.success('Habit deleted');
      } else {
        toast.error(res.data.message || 'Failed to delete habit');
      }
    } catch (error) {
      toast.error('Error deleting habit');
      console.error(error);
    }
  };

  // Calculate how many habits are completed today
  const completedToday = habits.filter(h => h.completions.some(date => isToday(date))).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  if (loading) {
    return <div className="text-center py-20 text-gray-600">Loading habits...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Your Habits</h2>
              <p className="text-emerald-100">Build consistency, one day at a time</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{completedToday}/{totalHabits}</div>
            <div className="text-emerald-100">completed today</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Completion Rate</h3>
              <p className="text-sm text-gray-600">Today</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-gray-900">{completionRate}%</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Longest Streak</h3>
              <p className="text-sm text-gray-600">Personal best</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-gray-900">
              {habits.length ? Math.max(...habits.map((h) => h.streak)) : 0}
            </span>
            <span className="text-orange-500 font-medium">days</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Total Habits</h3>
              <p className="text-sm text-gray-600">Active tracking</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-gray-900">{totalHabits}</span>
            <span className="text-blue-500 font-medium">habits</span>
          </div>
        </div>
      </div>

      {/* Add New Habit Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddHabit(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Habit</span>
        </button>
      </div>

      {/* Add Habit Modal */}
      {showAddHabit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Add New Habit</h3>
              <button
                onClick={() => setShowAddHabit(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Habit Name
                </label>
                <input
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="e.g., Drink 8 glasses of water"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Icon
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {icons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setNewHabitIcon(icon)}
                      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl transition-all duration-200 ${
                        newHabitIcon === icon
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setNewHabitColor(color.name)}
                      className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 ${color.class} ${
                        newHabitColor === color.name
                          ? 'border-gray-800 scale-110'
                          : 'border-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddHabit(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={addNewHabit}
                  disabled={!newHabitName.trim() || saving}
                  className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Add Habit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.map((habit) => {
          // Determine if habit is completed today
          const completedToday = habit.completions.some(date => isToday(date));

          return (
            <div
              key={habit._id}
              className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
                completedToday
                  ? `${getBorderClass(habit.color)} bg-gradient-to-br from-white to-gray-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-12 h-12 ${getColorClass(habit.color)} rounded-xl flex items-center justify-center text-white text-xl`}
                  >
                    {habit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{habit.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-600">{habit.streak} day streak</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleHabit(habit._id)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      completedToday
                        ? `${getBorderClass(habit.color)} ${getColorClass(habit.color)}`
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    title={completedToday ? 'Completed today' : 'Mark as complete'}
                  >
                    {completedToday && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={() => deleteHabit(habit._id)}
                    className="w-8 h-8 rounded-full border-2 border-red-400 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors"
                    title="Delete habit"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">{habit.streak} days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getColorClass(habit.color)}`}
                    style={{ width: `${Math.min((habit.streak / 30) * 100, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 text-center">
                  {habit.streak < 30
                    ? `${30 - habit.streak} days to 30-day milestone`
                    : 'Milestone achieved! 🎉'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
