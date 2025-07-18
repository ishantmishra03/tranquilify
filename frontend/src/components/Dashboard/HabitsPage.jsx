import { useEffect, useState } from "react";
import { Target, Plus, Flame, TrendingUp, CheckCircle, X } from "lucide-react";
import axios from "../../config/axios";
import { toast } from "react-hot-toast";
import { useAppContext } from "../../context/AppContext"; 

const colors = [
  { name: "blue", class: "bg-blue-500" },
  { name: "emerald", class: "bg-emerald-500" },
  { name: "purple", class: "bg-purple-500" },
  { name: "rose", class: "bg-rose-500" },
  { name: "orange", class: "bg-orange-500" },
  { name: "indigo", class: "bg-indigo-500" },
  { name: "green", class: "bg-green-500" },
  { name: "sky", class: "bg-sky-500" },
];

const getColorClass = (color, isDarkMode) => {
  const colorMap = {
    emerald: isDarkMode ? "bg-emerald-600" : "bg-emerald-500",
    blue: isDarkMode ? "bg-blue-600" : "bg-blue-500",
    purple: isDarkMode ? "bg-purple-600" : "bg-purple-500",
    indigo: isDarkMode ? "bg-indigo-600" : "bg-indigo-500",
    green: isDarkMode ? "bg-green-600" : "bg-green-500",
    sky: isDarkMode ? "bg-sky-600" : "bg-sky-500",
    rose: isDarkMode ? "bg-rose-600" : "bg-rose-500",
    orange: isDarkMode ? "bg-orange-600" : "bg-orange-500",
  };
  return colorMap[color] || (isDarkMode ? "bg-gray-700" : "bg-gray-500");
};

const getBorderClass = (color, isDarkMode) => {
  const colorMap = {
    emerald: isDarkMode ? "border-emerald-600" : "border-emerald-500",
    blue: isDarkMode ? "border-blue-600" : "border-blue-500",
    purple: isDarkMode ? "border-purple-600" : "border-purple-500",
    indigo: isDarkMode ? "border-indigo-600" : "border-indigo-500",
    green: isDarkMode ? "border-green-600" : "border-green-500",
    sky: isDarkMode ? "border-sky-600" : "border-sky-500",
    rose: isDarkMode ? "border-rose-600" : "border-rose-500",
    orange: isDarkMode ? "border-orange-600" : "border-orange-500",
  };
  return colorMap[color] || (isDarkMode ? "border-gray-700" : "border-gray-500");
};

const isToday = (someDate) => {
  const today = new Date();
  const d = new Date(someDate);
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
};

const icons = ['🎯', '🏃', '📚', '🧘', '💧', '🥗', '😴', '🌱', '💪', '🎨', '🎵', '📝'];



export const HabitsPage = () => {
  const { isDarkMode } = useAppContext();

  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitIcon, setNewHabitIcon] = useState("🎯");
  const [newHabitColor, setNewHabitColor] = useState("blue");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/habits");
        if (res.data.success) {
          setHabits(res.data.habits);
        } else {
          toast.error("Failed to load habits");
        }
      } catch (error) {
        toast.error("Error fetching habits");
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
      const res = await axios.post("/api/habits", {
        name: newHabitName.trim(),
        icon: newHabitIcon,
        color: newHabitColor,
      });

      if (res.data.success) {
        setHabits((prev) => [res.data.habit, ...prev]);
        toast.success("Habit added");
        setNewHabitName("");
        setNewHabitIcon("🎯");
        setNewHabitColor("blue");
        setShowAddHabit(false);
      } else {
        toast.error(res.data.message || "Failed to add habit");
      }
    } catch (error) {
      toast.error("Error adding habit");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const toggleHabit = async (habitId) => {
    try {
      const res = await axios.patch(`/api/habits/${habitId}/toggle`);
      if (res.data.success) {
        setHabits((prev) =>
          prev.map((h) => (h._id === habitId ? res.data.habit : h))
        );
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Failed to toggle habit");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error toggling habit");
      console.error(error);
    }
  };

  const deleteHabit = async (habitId) => {
    if (!window.confirm("Delete this habit?")) return;

    try {
      const res = await axios.delete(`/api/habits/${habitId}`);
      if (res.data.success) {
        setHabits((prev) => prev.filter((h) => h._id !== habitId));
        toast.success("Habit deleted");
      } else {
        toast.error(res.data.message || "Failed to delete habit");
      }
    } catch (error) {
      toast.error("Error deleting habit");
      console.error(error);
    }
  };

  const completedToday = habits.filter((h) =>
    h.completions.some((date) => isToday(date))
  ).length;
  const totalHabits = habits.length;
  const completionRate =
    totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  if (loading) {
    return (
      <div
        className={`text-center py-20 ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Loading habits...
      </div>
    );
  }

  return (
    <div
      className={`space-y-6`}
    >
      {/* Header */}
      <div
        className={`rounded-2xl p-6 ${
          isDarkMode
            ? "bg-gradient-to-r from-emerald-700 to-teal-700 text-emerald-200"
            : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Target
              className={`w-8 h-8 ${isDarkMode ? "text-emerald-400" : ""}`}
            />
            <div>
              <h2
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-emerald-200" : ""
                }`}
              >
                Your Habits
              </h2>
              <p
                className={`${
                  isDarkMode ? "text-emerald-300" : "text-emerald-100"
                }`}
              >
                Build consistency, one day at a time
              </p>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`text-3xl font-bold ${
                isDarkMode ? "text-emerald-300" : ""
              }`}
            >
              {completedToday}/{totalHabits}
            </div>
            <div className={isDarkMode ? "text-emerald-400" : "text-emerald-100"}>
              completed today
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Completion Rate Card */}
        <div
          className={`rounded-2xl p-6 shadow-lg border ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
          }`}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isDarkMode ? "bg-emerald-700" : "bg-emerald-100"
              }`}
            >
              <CheckCircle
                className={`w-6 h-6 ${
                  isDarkMode ? "text-emerald-400" : "text-emerald-600"
                }`}
              />
            </div>
            <div>
              <h3
                className={`font-semibold ${
                  isDarkMode ? "text-gray-300" : "text-gray-900"
                }`}
              >
                Completion Rate
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Today
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`text-3xl font-bold ${
                isDarkMode ? "text-gray-200" : "text-gray-900"
              }`}
            >
              {completionRate}%
            </span>
            <div
              className={`flex-1 rounded-full h-2 ${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              }`}
            >
              <div
                className={`${getColorClass(
                  "emerald",
                  isDarkMode
                )} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Longest Streak Card */}
        <div
          className={`rounded-2xl p-6 shadow-lg border ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
          }`}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isDarkMode ? "bg-orange-700" : "bg-orange-100"
              }`}
            >
              <Flame
                className={`w-6 h-6 ${
                  isDarkMode ? "text-orange-400" : "text-orange-600"
                }`}
              />
            </div>
            <div>
              <h3
                className={`font-semibold ${
                  isDarkMode ? "text-gray-300" : "text-gray-900"
                }`}
              >
                Longest Streak
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Personal best
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`text-3xl font-bold ${
                isDarkMode ? "text-gray-200" : "text-gray-900"
              }`}
            >
              {habits.length ? Math.max(...habits.map((h) => h.streak)) : 0}
            </span>
            <span
              className={`font-medium ${
                isDarkMode ? "text-orange-400" : "text-orange-500"
              }`}
            >
              days
            </span>
          </div>
        </div>

        {/* Total Habits Card */}
        <div
          className={`rounded-2xl p-6 shadow-lg border ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
          }`}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isDarkMode ? "bg-blue-700" : "bg-blue-100"
              }`}
            >
              <TrendingUp
                className={`w-6 h-6 ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
            <div>
              <h3
                className={`font-semibold ${
                  isDarkMode ? "text-gray-300" : "text-gray-900"
                }`}
              >
                Total Habits
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Active tracking
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`text-3xl font-bold ${
                isDarkMode ? "text-gray-200" : "text-gray-900"
              }`}
            >
              {totalHabits}
            </span>
            <span
              className={`font-medium ${
                isDarkMode ? "text-blue-400" : "text-blue-500"
              }`}
            >
              habits
            </span>
          </div>
        </div>
      </div>

      {/* Add New Habit Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddHabit(true)}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl ${
            isDarkMode
              ? "bg-gradient-to-r from-emerald-700 to-teal-700 text-emerald-200 hover:from-emerald-800 hover:to-teal-800"
              : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
          }`}
        >
          <Plus className="w-5 h-5" />
          <span>Add New Habit</span>
        </button>
      </div>

      {/* Add Habit Modal */}
      {showAddHabit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div
            className={`w-full max-w-md rounded-2xl p-6 ${
              isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-900"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Add New Habit</h3>
              <button
                onClick={() => setShowAddHabit(false)}
                className={`p-2 rounded-lg hover:bg-gray-100 ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <X
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Habit Name</label>
                <input
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="e.g., Drink 8 glasses of water"
                  className={`w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400"
                      : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Choose Icon</label>
                <div className="grid grid-cols-6 gap-2">
                  {icons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setNewHabitIcon(icon)}
                      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl transition-all duration-200 ${
                        newHabitIcon === icon
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : isDarkMode
                          ? "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Choose Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setNewHabitColor(color.name)}
                      className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 ${
                        newHabitColor === color.name
                          ? "border-gray-800 scale-110"
                          : isDarkMode
                          ? "border-gray-600"
                          : "border-gray-300"
                      } ${getColorClass(color.name, isDarkMode)}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddHabit(false)}
                  className={`flex-1 rounded-lg border px-4 py-3 transition-colors hover:bg-gray-50 ${
                    isDarkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700"
                  }`}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={addNewHabit}
                  disabled={!newHabitName.trim() || saving}
                  className={`flex-1 rounded-lg px-4 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDarkMode
                      ? "bg-emerald-600 text-emerald-200 hover:bg-emerald-700"
                      : "bg-emerald-500 text-white hover:bg-emerald-600"
                  }`}
                >
                  {saving ? "Saving..." : "Add Habit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Habits Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => {
          const completedToday = habit.completions.some((date) => isToday(date));

          return (
            <div
              key={habit._id}
              className={`rounded-2xl border-2 p-6 shadow-lg transition-all duration-200 hover:shadow-xl ${
                completedToday
                  ? `${getBorderClass(habit.color, isDarkMode)} bg-gradient-to-br ${
                      isDarkMode
                        ? "from-gray-800 to-gray-900"
                        : "from-white to-gray-50"
                    }`
                  : isDarkMode
                  ? "border-gray-700 bg-gray-900 hover:border-gray-600"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`${getColorClass(
                      habit.color,
                      isDarkMode
                    )} flex h-12 w-12 items-center justify-center rounded-xl text-xl text-white`}
                  >
                    {habit.icon}
                  </div>
                  <div>
                    <h3
                      className={`font-semibold ${
                        isDarkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {habit.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {habit.streak} day streak
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleHabit(habit._id)}
                    title={completedToday ? "Completed today" : "Mark as complete"}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                      completedToday
                        ? `${getBorderClass(habit.color, isDarkMode)} ${getColorClass(
                            habit.color,
                            isDarkMode
                          )}`
                        : isDarkMode
                        ? "border-gray-600 hover:border-gray-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {completedToday && (
                      <svg
                        className="h-4 w-4 text-white"
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
                    title="Delete habit"
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-red-400 text-red-500 hover:bg-red-100 transition-colors dark:hover:bg-red-900"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Progress
                  </span>
                  <span className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                    {habit.streak} days
                  </span>
                </div>
                <div className={`h-2 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                  <div
                    className={`${getColorClass(habit.color, isDarkMode)} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min((habit.streak / 30) * 100, 100)}%` }}
                  />
                </div>
                <div className={`text-xs text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {habit.streak < 30
                    ? `${30 - habit.streak} days to 30-day milestone`
                    : "Milestone achieved! 🎉"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
