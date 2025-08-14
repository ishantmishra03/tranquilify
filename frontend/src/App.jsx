import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useAppContext } from "./context/AppContext";
import axios from "./config/axios";

import Home from "./pages/Home";
import { Auth } from "./pages/Auth/Auth";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import Therapist from "./pages/Therapist/Therapist";
import StressData from "./components/Dashboard/StressData";

import { MoodGraphPage } from "./pages/Figure/MoodGraphPage";
import { StressGraphPage } from "./pages/Figure/StressGraphPage";
import AmbientRoom from "./pages/Ambientroom";

import Blogs from "./pages/Blogs/Blogs";
import BlogPage from "./components/Blogs/BlogPage";

import ProtectedRoute from "./config/ProtectedRoute";
import Settings from "./pages/Settings/Settings";
import Agent from "./pages/Agent";

const App = () => {
  const { setIsAuthenticated, setLoading } = useAppContext();
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/auth/isAuth");
      if (data.success) {
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/ambient-room" element={<AmbientRoom />}/>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent"
          element={
            <ProtectedRoute>
              <Agent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/therapist"
          element={
            <ProtectedRoute>
              <Therapist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stress-data"
          element={
            <ProtectedRoute>
              <StressData />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mood-graph"
          element={
            <ProtectedRoute>
              <MoodGraphPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stress-graph"
          element={
            <ProtectedRoute>
              <StressGraphPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
