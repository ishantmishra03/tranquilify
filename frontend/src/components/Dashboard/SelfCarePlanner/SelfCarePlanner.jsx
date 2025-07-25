import React, { useState } from "react";
import axios from "../../../config/axios";
import jsPDF from "jspdf";
import { toast } from "react-hot-toast";
import { useAppContext } from "../../../context/AppContext";

const SelfCarePlanner = ({ mood, stressLevel }) => {
  const { isDarkMode } = useAppContext();
  const [habits, setHabits] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const parsedHabits = habits
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean); 

  const handleGeneratePlan = async () => {
    if (parsedHabits.length === 0) {
      toast.error("Please enter at least one habit before generating the plan.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "/api/ai/self-care-plan",
        {
          mood,
          stress_level: stressLevel,
          habits: parsedHabits,
        }
      );

      if (response.data.success) {
        setPlan(response.data.plan);
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!plan) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Your Self-Care Plan", 14, 22);
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(plan, 180);
    doc.text(splitText, 14, 30);
    doc.save("self-care-plan.pdf");
  };

  return (
    <div
      className={`p-6 shadow-xl rounded-xl max-w-3xl mx-auto mt-6 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-2xl font-bold text-[#14B8A6] mb-4">
        AI-Powered Self-Care Planner
      </h2>

      <p className="text-sm mb-2 text-gray-500 dark:text-gray-400">
        <span className="font-semibold">Mood:</span> {mood} &nbsp;|&nbsp;
        <span className="font-semibold">Stress Level:</span> {stressLevel}/5
      </p>

      <label
        className={`block mb-2 font-medium ${
          isDarkMode ? "text-gray-200" : "text-gray-700"
        }`}
      >
        Recent Habits (comma separated)
      </label>
      <input
        type="text"
        value={habits}
        onChange={(e) => setHabits(e.target.value)}
        placeholder="e.g. exercise, meditation, overthinking"
        className={`w-full p-2 mb-4 rounded-md transition-colors ${
          isDarkMode
            ? "bg-gray-800 text-white border border-gray-700"
            : "bg-white text-gray-900 border border-gray-300"
        }`}
      />

      <button
        onClick={handleGeneratePlan}
        disabled={loading || parsedHabits.length === 0}
        className="bg-[#14B8A6] text-white px-4 py-2 rounded-md hover:bg-[#0f766e] transition disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Self-Care Plan"}
      </button>

      {plan && (
        <>
          <div
            className={`mt-6 p-4 rounded-md whitespace-pre-line border transition-colors ${
              isDarkMode
                ? "bg-gray-800 text-white border-gray-700"
                : "bg-gray-100 text-gray-900 border-gray-200"
            }`}
          >
            {plan}
          </div>
          <button
            onClick={downloadPDF}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Download as PDF
          </button>
        </>
      )}
    </div>
  );
};

export default SelfCarePlanner;
