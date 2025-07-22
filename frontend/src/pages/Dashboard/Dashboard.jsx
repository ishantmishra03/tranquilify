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
  Waves,
  Sun,
  Moon,
  HeartHandshake,
  BookAIcon
} from "lucide-react";
import { DashboardMain } from "../../components/Dashboard/DashboardMain";
import MoodCheck from "../../components/Dashboard/MoodCheck";
import { StressForm } from "../../components/Dashboard/StressForm";
import { HabitsPage } from "../../components/Dashboard/HabitsPage";
import Soundscape from "../../components/Dashboard/Soundscape";
import SelfCarePlanner from "../../components/Dashboard/SelfCarePlanner/SelfCarePlanner";
import Journal from "../../components/Dashboard/Journal/Journal";
import Logo from "../../components/Favicon/Logo";

export const Dashboard = () => {
  const {
    userData,
    setIsAuthenticated,
    avgStressLevel,
    avgMoodLevel,
    isDarkMode,
    setIsDarkMode,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  //Dummy Data
  useEffect(() => {
    const loadData = async () => {
      try {
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
              tip: "Try the 4-4-6 breathing technique: Inhale for 4 counts, hold for 4, exhale for 6.",
              category: "breathing",
              icon: "🌬️",
            },
          ],
        };
        setData(fallbackData);
      } catch (error) {
        console.log(error.message);
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
    { id: "therapist", label: "Therapist", icon: Bot },
    { id: "habits", label: "Habits", icon: Target },
    { id: "soundscape", label: "Soundscape", icon: Waves },
    {id: "journal", label : "Journal", icon: BookAIcon},
    { id: "self-care", label: "Self-care", icon: HeartHandshake },
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

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
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
        return <Soundscape mood={avgMoodLevel} stressLevel={avgStressLevel} />;
      case "journal":
        return <Journal />
      case "self-care":
        return (
          <SelfCarePlanner mood={avgMoodLevel} stressLevel={avgStressLevel} />
        );
      case "therapist":
        return <Navigate to="/therapist" replace={true} />;
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
    <div
      className={`min-h-screen font-['Inter'] flex ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200"
          : "bg-gradient-to-br from-blue-50 via-white to-rose-50 text-gray-900"
      }`}
    >
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isDarkMode
            ? "bg-gray-900 text-gray-200"
            : "bg-white text-gray-900 border-r border-gray-200"
        } ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 shadow-xl`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 cursor-pointer">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl">
              <Logo width="50" height="50" />
            </div>
            <span className="text-xl font-semibold">Tranquilify</span>
          </Link>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ml-2"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-semibold">
              {userData?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("") || ""}
            </div>
            <div>
              <div className="font-semibold">{userData.name}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg"
                        : isDarkMode
                        ? "hover:bg-gray-800 text-gray-300"
                        : "hover:bg-gray-100 text-gray-700"
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

        <div
          className={`p-4 mt-auto flex flex-col space-y-3 ${
            isDarkMode ? "border-t border-gray-700" : ""
          }`}
        >
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header
          className={`sticky top-0 z-30 border-b ${
            isDarkMode
              ? "border-gray-700 bg-gray-900/80 backdrop-blur"
              : "border-gray-200 bg-white/80 backdrop-blur"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Open sidebar"
              >
                <Menu
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-gray-200" : "text-gray-600"
                  }`}
                />
              </button>
              <div>
                <h1 className="text-2xl font-bold capitalize">
                  {activeTab.replace("-", " ")}
                </h1>
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
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
              {/* User avatar */}
              <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {userData?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || ""}
              </div>

              {/* Dark mode toggle at top right of sidebar header */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle dark mode"
                title="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="w-6 h-6 text-yellow-400" />
                ) : (
                  <Moon className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main dashboard content */}
        <main className="p-6 flex-grow overflow-auto">{renderContent()}</main>
      </div>
    </div>
  );
};
