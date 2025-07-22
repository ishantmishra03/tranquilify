import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { useAppContext } from "../context/AppContext";
import { Loader2, Lock, Mail } from "lucide-react";
import { useEffect } from "react";

const Auth = () => {
  const { login, isLoggedIn } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if(isLoggedIn){
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate])

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "/api/admin",
        { email, password }
      );

      if (res.data.success) {
        login();
        navigate("/dashboard");
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[#121212] text-gray-100">
      <div className="w-full max-w-md bg-[#1e293b] rounded-3xl shadow-lg p-8">
        <h2 className="text-3xl font-semibold mb-6 text-center">Admin Login</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <label className="block">
            <span className="flex items-center gap-2 mb-1 text-sm font-medium">
              <Mail className="w-5 h-5" />
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="admin@example.com"
              autoComplete="username"
            />
          </label>

          {/* Password */}
          <label className="block">
            <span className="flex items-center gap-2 mb-1 text-sm font-medium">
              <Lock className="w-5 h-5" />
              Password
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-400 rounded-md py-2 font-semibold transition-colors disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
