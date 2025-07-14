import React, { useState, useEffect } from "react";
import {
  Activity,
  TrendingDown,
  TrendingUp,
  Calendar,
  BarChart3,
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

export default function StressData() {
  const navigate = useNavigate();
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button top right */}
      <button
        onClick={() => navigate(-1)}
        aria-label="Go Back"
        className="absolute top-4 left-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 shadow-md transition-colors"
      >
        <ArrowLeft className="w-6 h-6 text-gray-700" />
      </button>
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
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

     

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Average Stress</h3>
              <p className="text-sm text-gray-600">Overall level</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-gray-900">{calculateAverageStress()}</span>
            <span className="text-orange-500 font-medium">/4</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Stress Trend</h3>
              <p className="text-sm text-gray-600">Recent change</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-3xl font-bold ${stressTrend < 0 ? "text-green-600" : "text-red-600"}`}>
              {stressTrend > 0 ? "+" : ""}
              {stressTrend}%
            </span>
            {stressTrend < 0 ? (
              <TrendingDown className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingUp className="w-5 h-5 text-red-600" />
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">High Stress Days</h3>
              <p className="text-sm text-gray-600">Level 3-4</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-gray-900">
              {stressAssessments.filter((a) => a.stressLevel >= 3).length}
            </span>
            <span className="text-red-500 font-medium">days</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Coping Strategies</h3>
              <p className="text-sm text-gray-600">Used</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-gray-900">{copingStats.length}</span>
            <span className="text-emerald-500 font-medium">types</span>
          </div>
        </div>
      </div>

      {/* Stress Level Timeline & Top Stress Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stress Level Timeline */}
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Stress Level Timeline</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {stressAssessments.slice(0, 7).map((assessment) => (
              <div key={assessment._id} className="flex items-center space-x-4">
                <div className="w-16 text-sm text-gray-600">
                  {new Date(assessment.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {getStressLevelLabel(assessment.stressLevel)}
                    </span>
                    <span className="text-sm text-gray-600">{assessment.stressLevel}/4</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getStressLevelColor(
                        assessment.stressLevel
                      )}`}
                      style={{ width: `${(assessment.stressLevel / 4) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Stress Factors */}
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Top Stress Factors</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {factorStats.map((factor) => (
              <div key={factor.item} className="flex items-center space-x-4">
                <div className="w-20 truncate text-sm text-gray-600">{factor.item}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{factor.count} times</span>
                    <span className="text-sm text-gray-600">{factor.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${factor.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Common Symptoms & Effective Coping Strategies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Common Symptoms */}
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Common Symptoms</h3>
            <Heart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {symptomStats.map((symptom) => (
              <div
                key={symptom.item}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">{symptom.item}</span>
                </div>
                <div className="text-sm text-red-600 font-medium">
                  {symptom.count} times ({symptom.percentage}%)
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Effective Coping Strategies */}
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Coping Strategies</h3>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {copingStats.map((strategy) => (
              <div
                key={strategy.item}
                className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">{strategy.item}</span>
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
      <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Recent Assessments</h3>
          <Brain className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {stressAssessments
            .slice(0, 3)
            .reverse()
            .map((assessment) => (
              <div key={assessment._id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${getStressLevelColor(assessment.stressLevel)}`}></div>
                    <span className="font-medium text-gray-900">
                      {getStressLevelLabel(assessment.stressLevel)}
                    </span>
                  </div>
                  <time className="text-sm text-gray-500">
                    {new Date(assessment.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {assessment.stressFactors.map((factor, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs truncate max-w-xs"
                      title={factor}
                    >
                      {factor}
                    </span>
                  ))}
                  {assessment.symptoms.map((symptom, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs truncate max-w-xs"
                      title={symptom}
                    >
                      {symptom}
                    </span>
                  ))}
                  {assessment.copingStrategies.map((strategy, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs truncate max-w-xs"
                      title={strategy}
                    >
                      {strategy}
                    </span>
                  ))}
                </div>
                {assessment.notes && (
                  <p className="mt-3 text-gray-700 text-sm whitespace-pre-wrap">{assessment.notes}</p>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
