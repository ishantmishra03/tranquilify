import React, { useState, useEffect } from "react";
import {
  Activity,
  TrendingDown,
  TrendingUp,
  Calendar,
  PieChart,
  AlertTriangle,
  CheckCircle,
  Brain,
  Heart,
  Target,
  ArrowLeft,
} from "lucide-react";
import axios from "../../config/axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext"; 

export default function StressData() {
  const navigate = useNavigate();
  const { isDarkMode } = useAppContext(); 
  const [stressAssessments, setStressAssessments] = useState([]);

  const fetchStressAssessments = async () => {
    try {
      const { data } = await axios.get("/api/stress");
      if (data.success && Array.isArray(data.data)) {
        setStressAssessments(data.data.reverse());
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch stress data");
    }
  };

  useEffect(() => {
    fetchStressAssessments();
  }, []);

  const getStressLevelColor = (level) => {
    const colors = [
      "bg-green-500",
      "bg-yellow-500",
      "bg-orange-500",
      "bg-red-500",
      "bg-red-600",
    ];
    return colors[level] || "bg-gray-300";
  };

  const getStressLevelLabel = (level) => {
    const labels = ["Very Low", "Low", "Moderate", "High", "Very High"];
    return labels[level] || "Unknown";
  };

  const calculateAverageStress = () => {
    if (stressAssessments.length === 0) return 0;
    const sum = stressAssessments.reduce((acc, a) => acc + a.stressLevel, 0);
    return (sum / stressAssessments.length).toFixed(1);
  };

  const getTopStats = (key) => {
    const counts = {};
    stressAssessments.forEach((a) => {
      a[key].forEach((item) => {
        counts[item] = (counts[item] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([item, count]) => ({
        item,
        count,
        percentage: Math.round((count / stressAssessments.length) * 100),
      }));
  };

  const getStressTrend = () => {
    if (stressAssessments.length < 2) return 0;
    const recent = stressAssessments.slice(0, Math.ceil(stressAssessments.length / 2));
    const older = stressAssessments.slice(Math.ceil(stressAssessments.length / 2));
    const avg = (arr) => arr.reduce((acc, a) => acc + a.stressLevel, 0) / arr.length;
    const recentAvg = avg(recent);
    const olderAvg = avg(older);
    return ((recentAvg - olderAvg) / olderAvg * 100).toFixed(1);
  };

  const factorStats = getTopStats("stressFactors");
  const symptomStats = getTopStats("symptoms");
  const copingStats = getTopStats("copingStrategies");
  const stressTrend = parseFloat(getStressTrend());

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 space-y-6 transition-all duration-300 ${isDarkMode ? "bg-slate-900 text-gray-100" : "bg-white text-gray-900"}`}>
      <button
        onClick={() => navigate(-1)}
        aria-label="Go Back"
        className={`absolute top-4 left-4 p-2 rounded-full shadow-md transition-colors ${isDarkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-gray-100 hover:bg-gray-200"}`}
      >
        <ArrowLeft className={`${isDarkMode ? "text-gray-100" : "text-gray-700"}`} />
      </button>

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Stress Analytics</h2>
              <p className="text-orange-100 text-sm sm:text-base">
                Insights into your stress patterns and management
              </p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <div className="text-3xl font-bold">{stressAssessments.length}</div>
            <div className="text-orange-100 text-sm sm:text-base">assessments</div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: <Activity className="w-6 h-6 text-orange-600" />,
            title: "Average Stress",
            value: `${calculateAverageStress()}`,
            suffix: "/4",
            bg: "bg-orange-100",
          },
          {
            icon: <TrendingDown className="w-6 h-6 text-blue-600" />,
            title: "Stress Trend",
            value: `${stressTrend > 0 ? "+" : ""}${stressTrend}%`,
            iconRight: stressTrend < 0 ? (
              <TrendingDown className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingUp className="w-5 h-5 text-red-600" />
            ),
            valueColor: stressTrend < 0 ? "text-green-600" : "text-red-600",
            bg: "bg-blue-100",
          },
          {
            icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
            title: "High Stress Days",
            value: stressAssessments.filter((a) => a.stressLevel >= 3).length,
            suffix: "days",
            bg: "bg-red-100",
          },
          {
            icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
            title: "Coping Strategies",
            value: copingStats.length,
            suffix: "types",
            bg: "bg-emerald-100",
          },
        ].map((card, i) => (
          <div
            key={i}
            className={`rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center`}>
                {card.icon}
              </div>
              <div>
                <h3 className="font-semibold">{card.title}</h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Summary</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-3xl font-bold ${card.valueColor || ""}`}>{card.value}</span>
              {card.suffix && <span className="font-medium text-orange-500">{card.suffix}</span>}
              {card.iconRight}
            </div>
          </div>
        ))}
      </div>

           {/* Stress Timeline & Top Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timeline */}
        <div className={`rounded-2xl p-6 shadow-md hover:shadow-xl border transition-shadow ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Stress Level Timeline</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {stressAssessments.slice(0, 7).map((a) => (
              <div key={a._id} className="flex items-center space-x-4">
                <div className="w-16 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(a.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{getStressLevelLabel(a.stressLevel)}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{a.stressLevel}/4</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getStressLevelColor(a.stressLevel)}`}
                      style={{ width: `${(a.stressLevel / 4) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Stress Factors */}
        <div className={`rounded-2xl p-6 shadow-md hover:shadow-xl border transition-shadow ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Top Stress Factors</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {factorStats.map((factor) => (
              <div key={factor.item} className="flex items-center space-x-4">
                <div className="w-20 truncate text-sm text-gray-500 dark:text-gray-400">{factor.item}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{factor.count} times</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{factor.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full"
                      style={{ width: `${factor.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Symptoms & Coping */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Symptoms */}
        <div className={`rounded-2xl p-6 shadow-md hover:shadow-xl border transition-shadow ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Common Symptoms</h3>
            <Heart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {symptomStats.map((symptom) => (
              <div
                key={symptom.item}
                className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? "bg-red-900/20" : "bg-red-50"}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="font-medium">{symptom.item}</span>
                </div>
                <div className="text-sm text-red-600 font-medium">
                  {symptom.count} times ({symptom.percentage}%)
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coping Strategies */}
        <div className={`rounded-2xl p-6 shadow-md hover:shadow-xl border transition-shadow ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Coping Strategies</h3>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {copingStats.map((strategy) => (
              <div
                key={strategy.item}
                className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? "bg-emerald-900/20" : "bg-emerald-50"}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="font-medium">{strategy.item}</span>
                </div>
                <div className="text-sm text-emerald-600 font-medium">
                  {strategy.count} times ({strategy.percentage}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Assessments */}
      <div className={`rounded-2xl p-6 shadow-md hover:shadow-xl border transition-shadow ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Recent Assessments</h3>
          <Brain className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {stressAssessments.slice(-3).map((a) => (
            <div key={a._id} className={`border rounded-xl p-4 ${isDarkMode ? "border-slate-700" : "border-gray-200"}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${getStressLevelColor(a.stressLevel)}`} />
                  <span className="font-medium">{getStressLevelLabel(a.stressLevel)}</span>
                </div>
                <time className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(a.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>

              <div className="flex flex-wrap gap-2 mt-1">
                {a.stressFactors.map((f, i) => (
                  <span
                    key={`f-${i}`}
                    className="inline-block bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs truncate max-w-xs"
                    title={f}
                  >
                    {f}
                  </span>
                ))}
                {a.symptoms.map((s, i) => (
                  <span
                    key={`s-${i}`}
                    className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs truncate max-w-xs"
                    title={s}
                  >
                    {s}
                  </span>
                ))}
                {a.copingStrategies.map((c, i) => (
                  <span
                    key={`c-${i}`}
                    className="inline-block bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs truncate max-w-xs"
                    title={c}
                  >
                    {c}
                  </span>
                ))}
              </div>

              {a.notes && (
                <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {a.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
