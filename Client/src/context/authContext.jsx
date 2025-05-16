// AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true; // Ensure cookies are sent

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:4001/auth/me', {
          withCredentials: true
        });
        setUser(response.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await axios.post("http://localhost:4001/auth/logout");
      setUser(null);
      toast.success("Logged out successfully");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const value = {
    user,
    setUser,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
