import { useEffect, useState } from "react";
import { Heart, TrendingUp } from "lucide-react";
import axios from "../../config/axios";
import { toast } from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const moodMap = {
  "Very Sad": 1,
  Sad: 2,
  Neutral: 3,
  Happy: 4,
  "Very Happy": 5,
};

const getMoodEmoji = (mood) => {
  if (mood >= 5) return "😊";
  if (mood >= 4) return "🙂";
  if (mood >= 3) return "😐";
  if (mood >= 2) return "😔";
  return "😢";
};

export const MoodCard = () => {
  const { setAvgMoodLevel, isDarkMode } = useAppContext();
  const [averageMood, setAverageMood] = useState(0);
  const [moodImprovement, setMoodImprovement] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAverageMood = async () => {
      try {
        const res = await axios.get("/api/mood/user");
        if (res.data.success && res.data.moodData.length > 0) {
          const moods = res.data.moodData.map((entry) => {
            if (typeof entry.mood === "string") {
              return moodMap[entry.mood] ?? 3; 
            }
            return Number(entry.mood);
          });
          const avg = moods.reduce((a, b) => a + b, 0) / moods.length;
          setAverageMood(avg.toFixed(1));
          setAvgMoodLevel(avg.toFixed(1));
          setMoodImprovement(8); // Example value
        } else {
          setAverageMood(0);
        }
      } catch (err) {
        console.error("Error fetching mood data:", err);
        toast.error("Failed to load mood data");
        setAverageMood(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAverageMood();
  }, []);

  return (
    <div
      className={`rounded-2xl p-6 shadow-lg border ${
        isDarkMode
          ? "bg-gray-900 border-gray-700 text-gray-200"
          : "bg-white border-gray-100 text-gray-900"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isDarkMode ? "bg-rose-800" : "bg-rose-100"
            }`}
          >
            <Heart
              className={`w-6 h-6 ${
                isDarkMode ? "text-rose-400" : "text-rose-600"
              }`}
            />
          </div>
          <div>
            <h3
              className={`font-semibold ${
                isDarkMode ? "text-gray-200" : "text-gray-900"
              }`}
            >
              Average Mood
            </h3>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              This week
            </p>
          </div>
        </div>
        <div
          className={`flex items-center space-x-1 ${
            isDarkMode ? "text-emerald-400" : "text-emerald-600"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">+{moodImprovement}%</span>
        </div>
      </div>
      {loading ? (
        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          Loading...
        </p>
      ) : (
        <div className="flex items-center space-x-2">
          <span className={`text-3xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
            {averageMood}
          </span>
          <span className="text-3xl">{getMoodEmoji(averageMood)}</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`w-2 h-6 rounded-full transition-colors duration-300 ${
                  averageMood >= level
                    ? isDarkMode
                      ? "bg-rose-500"
                      : "bg-rose-400"
                    : isDarkMode
                    ? "bg-gray-700"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
