import { createContext, useContext, useEffect, useState } from "react";
import axios from "../config/axios"; 
import { toast } from 'react-hot-toast';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user info on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {data} = await axios.get("/api/auth/isAuth");
        setUser(data.user);
      } catch (err) {
        toast.error(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Logout
  const logout = async () => {
    try {
        setLoading(true);
        const { data } = await axios.post("/api/auth/logout");
        toast.success(data.message);
        setUser(null);
    } catch (error) {
        toast.error(error.message);
    } finally{
        setLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook
export const useAppContext = () => useContext(AppContext);
