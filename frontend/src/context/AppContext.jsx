import { createContext, useContext, useEffect, useState } from "react";
import axios from '../config/axios';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") return true;
    if (savedTheme === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [userData, setUserData] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const [avgStressLevel, setAvgStressLevel] = useState(null);
  const [avgMoodLevel, setAvgMoodLevel] = useState(null);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const fetchUserData = async () => {
    try {
      const { data } = await axios.get('/api/user');
      if (data.success) {
        setUserData(data.user);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, [])

  return (
    <AppContext.Provider
      value={{
        loading,
        setLoading,
        isAuthenticated,
        setIsAuthenticated,
        userData,
        isDarkMode,
        setIsDarkMode,
        avgStressLevel, setAvgStressLevel,
        avgMoodLevel, setAvgMoodLevel,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};


export const useAppContext = () => useContext(AppContext);
