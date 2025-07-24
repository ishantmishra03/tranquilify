import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "../../config/axios";

const Settings = () => {
  const { isDarkMode, setIsAuthenticated } = useAppContext();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState(null); // 'reset' or 'delete'
  const [canReset, setCanReset] = useState(true);

  useEffect(() => {
    const lastReset = localStorage.getItem("lastResetTime");
    if (lastReset) {
      const elapsed = Date.now() - Number(lastReset);
      if (elapsed < 24 * 60 * 60 * 1000) {
        setCanReset(false);
      }
    }
  }, []);

  const handleResetClick = () => {
    if (!canReset) {
      toast.error("You can only reset once every 24 hours.");
      return;
    }
    setConfirmType("reset");
    setShowConfirm(true);
  };

  const handleDeleteClick = () => {
    setConfirmType("delete");
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);

    if (confirmType === "reset") {
      try {
        const { data } = await axios.get("/api/reset");
        if (data.success) {
          toast.success("App has been reset.");
          localStorage.setItem("lastResetTime", Date.now().toString());
          setCanReset(false);
        }
      } catch (error) {
        toast.error(error.response?.data.message || "Failed to reset app.");
      }
    } else if (confirmType === "delete") {
      try {
        const { data } = await axios.delete("/api/reset/delete");
        if (data.success) {
          localStorage.clear(); 
          toast.success("Account deleted successfully.");
          setIsAuthenticated(false);
          navigate("/"); 
        }
      } catch (error) {
        toast.error(
          error.response?.data.message || "Failed to delete account."
        );
      }
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <div
      className={`min-h-screen p-6 font-['Inter'] ${
        isDarkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-900"
      } flex flex-col items-center`}
    >
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className={`self-start mb-4 px-4 py-2 rounded ${
          isDarkMode
            ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
            : "bg-gray-200 hover:bg-gray-300 text-gray-900"
        }`}
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <button
        onClick={handleResetClick}
        disabled={!canReset}
        className={`mb-4 px-6 py-3 rounded-md transition ${
          canReset
            ? "bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            : "bg-gray-400 text-gray-700 cursor-not-allowed"
        }`}
      >
        Reset App
      </button>

      <button
        onClick={handleDeleteClick}
        className="px-6 py-3 bg-red-800 text-white rounded-md hover:bg-red-900 transition"
      >
        Delete Account Forever
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`rounded-lg p-6 max-w-sm w-full mx-4 ${
              isDarkMode
                ? "bg-gray-800 text-gray-200"
                : "bg-white text-gray-900"
            }`}
          >
            <h2 className="text-lg font-semibold mb-4">Warning</h2>
            <p className="mb-6">
              This action is <strong>irreversible</strong>. Please be careful.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                {confirmType === "reset" ? "Confirm Reset" : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
