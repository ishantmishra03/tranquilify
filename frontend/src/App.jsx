import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import {  useAppContext } from "./context/AppContext";
import axios from "./config/axios";

import Home from "./pages/Home";
import { Auth } from "./pages/Auth/Auth";
import Dashboard from "./pages/Dashboard/Dashboard";
import Mood from './pages/Mood';

import ProtectedRoute from './config/ProtectedRoute';

const App = () => {
  const {setIsAuthenticated, setLoading} = useAppContext();
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

  // Fetch user info on mount
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/mood" element={<Mood />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
};

export default App;
