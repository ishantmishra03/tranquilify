import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { StressGraph } from "../Figure/StressGraph";
import { MoodGraph } from "../Figure/MoodGraph";
import { StressCard } from "./StressCard";
import { MoodCard } from "./MoodCard";
import { TwoMinBreathing } from "../2MinBreathing";
import DailyQuotes from "./DailyQuotes";
import {
  TrendingUp,
  Zap,
  Lightbulb,
  Award,
  Brain,
  Wind,
  Activity,
} from "lucide-react";
import axios from "../../config/axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export const DashboardMain = ({ data }) => {
  const navigate = useNavigate();
  const { userData, isDarkMode } = useAppContext();
  const [habits, setHabits] = useState([]);
  const [loadingHabits, setLoadingHabits] = useState(true);
  const [showBreathing, setShowBreathing] = useState(false);

  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    const fetchLatestHabits = async () => {
      try {
        setLoadingHabits(true);
        const res = await axios.get("/api/habits/latest?limit=3");
        if (res.data.success) {
          setHabits(res.data.habits);
        } else {
          toast.error("Failed to load latest habits");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching latest habits");
      } finally {
        setLoadingHabits(false);
      }
    };

    fetchLatestHabits();
  }, []);

  const generatePDF = async () => {
    setPdfLoading(true);
    try {
      const res = await axios.get("/api/pdf", { responseType: "blob" });
      setPdfBlob(new Blob([res.data], { type: "application/pdf" }));
      toast.success("Mental Health Journal PDF generated!");
    } catch (error) {
      toast.error("Failed to generate PDF");
      console.error(error);
    }
    setPdfLoading(false);
  };

  const downloadPDF = () => {
    if (!pdfBlob) return;
    const url = window.URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mental-health-journal.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  
  const containerBg = isDarkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-900";
  const borderGray = isDarkMode ? "border-gray-700" : "border-gray-100";
  const cardShadow = isDarkMode ? "shadow-xl shadow-black/40" : "shadow-lg";
  const gradientBg = isDarkMode
    ? "bg-gradient-to-r from-sky-700 to-emerald-700 text-white"
    : "bg-gradient-to-r from-sky-500 to-emerald-500 text-white";
  const aiTipBg = isDarkMode ? "bg-gradient-to-r from-purple-900 to-pink-900 border-purple-700" : "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100";

  return (
    <div className="space-y-6">
      <div className={`${gradientBg} rounded-2xl p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {userData?.name?.split(" ")[0] || ""}! 👋
            </h2>
            <p className="text-sky-100 mb-4">
              You're doing great on your wellness journey
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span className="font-semibold">{userData.streak} day streak</span>
              </div>
            </div>
          </div>
          <div className="text-6xl opacity-20 select-none">🌿</div>
        </div>
      </div>

      {/* Try AI Therapist */}
      <div className="flex flex-wrap gap-4 justify-start">
        <Link
          to="/therapist"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white hover:from-sky-600 hover:to-emerald-600 transition shadow-lg hover:shadow-xl"
        >
          <Brain className="w-5 h-5" />
          <span className="text-sm font-medium">Try AI Therapist</span>
        </Link>
        <button
          onClick={() => setShowBreathing(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 text-white hover:from-emerald-600 hover:to-sky-600 transition shadow-lg hover:shadow-xl"
        >
          <Wind className="w-5 h-5" />
          <span className="text-sm font-medium">2-Min Magic</span>
        </button>
        <button
          onClick={() => navigate("/stress-data")}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 text-white hover:from-emerald-600 hover:to-sky-600 transition shadow-lg hover:shadow-xl"
        >
          <Activity className="w-5 h-5" />
          <span className="text-sm font-medium">Stress Data</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mood Card */}
        <MoodCard />

        {/* Stress Card */}
        <StressCard />

        {/* Energy Card */}
        <div
          className={`${containerBg} rounded-2xl p-6 ${cardShadow} border ${borderGray}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div
                className={`w-12 h-12 ${
                  isDarkMode ? "bg-yellow-800" : "bg-yellow-100"
                } rounded-xl flex items-center justify-center`}
              >
                <Zap
                  className={`w-6 h-6 ${
                    isDarkMode ? "text-yellow-400" : "text-yellow-600"
                  }`}
                />
              </div>
              <div>
                <h3 className={`${isDarkMode ? "text-gray-200" : "text-gray-900"} font-semibold`}>
                  Energy Level
                </h3>
                <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>
                  This week
                </p>
              </div>
            </div>
            <div className={`flex items-center space-x-1 ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">{`+${data.weeklyStats.energyIncrease}%`}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`${isDarkMode ? "text-gray-100" : "text-gray-900"} text-3xl font-bold`}>
              {data.weeklyStats.averageEnergy}
            </span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`w-2 h-6 rounded-full ${
                    level <= data.weeklyStats.averageEnergy
                      ? isDarkMode
                        ? "bg-yellow-500"
                        : "bg-yellow-400"
                      : isDarkMode
                      ? "bg-gray-700"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Quotes  */}
      <DailyQuotes />

      {/* Mood + Stress Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MoodGraph />
        <StressGraph />
      </div>

      {/* AI Tip of the Day */}
      <div
        className={`${aiTipBg} rounded-2xl p-6 border transition-colors duration-300`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3
                className={`text-xl font-semibold ${
                  isDarkMode ? "text-gray-200" : "text-gray-900"
                }`}
              >
                AI Wellness Tip
              </h3>
              <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>
                Personalized for you
              </p>
            </div>
          </div>
        </div>
        <div
          className={`${containerBg} rounded-xl p-4 shadow-sm transition-colors duration-300`}
        >
          <div className="flex items-start space-x-3">
            <span className="text-2xl">{data.aiTips[0].icon}</span>
            <div>
              <h4
                className={`font-semibold mb-2 ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {data.aiTips[0].title}
              </h4>
              <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed`}>
                {data.aiTips[0].tip}
              </p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                  isDarkMode
                    ? "bg-purple-700 text-purple-300"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {data.aiTips[0].category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Habits */}
      <div
        className={`${containerBg} rounded-2xl p-6 ${cardShadow} border ${borderGray}`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3
            className={`text-xl font-semibold ${
              isDarkMode ? "text-gray-200" : "text-gray-900"
            }`}
          >
            Latest Habits
          </h3>
        </div>

        {loadingHabits ? (
          <p className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Loading habits...
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {habits.map((habit) => (
              <div
                key={habit._id}
                className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  habit.completed
                    ? isDarkMode
                      ? "border-emerald-600 bg-emerald-900"
                      : "border-emerald-200 bg-emerald-50"
                    : isDarkMode
                    ? "border-gray-700 bg-gray-900 hover:border-gray-600"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{habit.icon}</span>
                  <div className="flex-1">
                    <h4
                      className={`font-medium ${
                        isDarkMode ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      {habit.name}
                    </h4>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      {habit.streak} day streak
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PDF Mental Health Journal Section */}
      <div
        className={`${containerBg} rounded-2xl p-6 ${cardShadow} border ${borderGray} max-w-md mx-auto mt-6`}
      >
        <h3
          className={`text-xl font-semibold mb-4 ${
            isDarkMode ? "text-gray-200" : "text-gray-900"
          }`}
        >
          Export Mental Health Journal
        </h3>
        <div className="flex space-x-4">
          <button
            onClick={generatePDF}
            disabled={pdfLoading}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition disabled:opacity-50"
          >
            {pdfLoading ? "Generating PDF..." : "Generate PDF"}
          </button>
          <button
            onClick={downloadPDF}
            disabled={!pdfBlob}
            className={`flex-1 ${
              pdfBlob
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-300 cursor-not-allowed"
            } text-white font-semibold py-2 rounded transition`}
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* Breathing exercise modal */}
      <div>{showBreathing && <TwoMinBreathing onClose={() => setShowBreathing(false)} />}</div>
    </div>
  );
};
