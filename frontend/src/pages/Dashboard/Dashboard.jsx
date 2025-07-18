import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import axios from "../../config/axios";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Home,
  Heart,
  Target,
  LogOut,
  Menu,
  X,
  Award,
  Activity,
  Bot,
  Waves ,
} from "lucide-react";
import { DashboardMain } from "../../components/Dashboard/DashboardMain";
import MoodCheck from "../../components/Dashboard/MoodCheck";
import { StressForm } from "../../components/Dashboard/StressForm";
import { HabitsPage } from "../../components/Dashboard/HabitsPage";
import Soundscape from "../../components/Dashboard/Soundscape";
import Logo from "../../components/Favicon/Logo";


export const Dashboard = () => {
  const { userData, setIsAuthenticated, avgStressLevel, avgMoodLevel } = useAppContext();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/src/data/data.json");
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.log(error.message);
        const fallbackData = {
          weeklyStats: {
            averageMood: 4.1,
            averageStress: 2.3,
            averageEnergy: 3.4,
            moodImprovement: 12,
            stressReduction: 18,
            energyIncrease: 8,
          },
          aiTips: [
            {
              id: 1,
              title: "Breathing Exercise",
              tip: "Try the 4-7-8 breathing technique: Inhale for 4 counts, hold for 7, exhale for 8.",
              category: "breathing",
              icon: "🌬️",
            },
          ],
        };
        setData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "mood-check", label: "Mood Check", icon: Heart },
    { id: "stress-form", label: "Stress Form", icon: Activity },
    { id: "habits", label: "Habits", icon: Target },
    {id: "therapist", label : "Therapist" , icon: Bot},
    {id: "soundscape", label : "Soundscape" , icon: Waves  },
  ];

  const handleLogout = async () => {
    try {
      const { data } = await axios.post("/api/auth/logout");
      if (data.success) {
        setIsAuthenticated(false);
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const renderContent = () => {
    if (!data) return null;

    switch (activeTab) {
      case "dashboard":
        return <DashboardMain data={data} />;
      case "mood-check":
        return <MoodCheck />;
      case "stress-form":
        return <StressForm />;
      case "habits":
        return <HabitsPage />;
      case "soundscape":
        return <Soundscape mood={avgMoodLevel} stressLevel={avgStressLevel}/>;
      case "therapist":
        return <Navigate to="/therapist" replace="true" />
      default:
        return <DashboardMain data={data} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-rose-50 font-['Inter']">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 cursor-pointer">
            <Link to="/">
              <div className="flex items-center space-x-2">
                <div className="text-2xl"><Logo width="50" height="50"/></div>
                <span className="text-xl font-semibold text-gray-800">
                  Tranquilify
                </span>
              </div>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-semibold">
               {userData?.name?.split(" ").map((n) => n[0]).join("") || ""}
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {userData.name}
                </div>
                <div className="text-sm text-gray-600">
                  {userData.streak} day streak 🔥
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeTab === item.id
                          ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="lg:ml-64">
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 capitalize">
                  {activeTab.replace("-", " ")}
                </h1>
                <p className="text-gray-600">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-emerald-50 px-3 py-2 rounded-full">
                <Award className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  {userData.streak} Day Streak
                </span>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {userData?.name?.split(" ").map((n) => n[0]).join("") || ""}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">{renderContent()}</main>
      </div>
    </div>
  );
};
