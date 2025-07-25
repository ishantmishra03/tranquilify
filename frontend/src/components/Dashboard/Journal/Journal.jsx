import React, { useEffect, useState } from "react";
import axios from "../../../config/axios";
import { Notebook, Sparkles, Trash2 } from "lucide-react";
import { useAppContext } from "../../../context/AppContext";
import { toast } from "react-hot-toast";

const Journal = () => {
  const { isDarkMode } = useAppContext();
  const [journals, setJournals] = useState([]);
  const [content, setContent] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchJournals = async () => {
    try {
      const {data} = await axios.get("/api/journal");
      if (data.success) {
        setJournals(data.journals);
      }
    } catch (err) {
      console.error("Fetch journals error:", err);
    }
  };

  const saveJournal = async () => {
    if (!content.trim()) return;
    try {
      const {data} = await axios.post("/api/journal", { content });
      if (data.success) {
        toast.success(data.message);
        setContent("");
        fetchJournals();
      }
    } catch (err) {
      console.error("Save journal error:", err);
    }
  };

  const deleteJournal = async (id) => {
    try {
      const {data} = await axios.delete(`/api/journal/${id}`);
      if (data.success) {
        toast.success(data.message);
        setJournals((prev) => prev.filter((j) => j._id !== id));
      }
    } catch (err) {
      console.error("Delete journal error:", err);
    }
  };

  const getReflectionPrompt = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/ai/journal-prompt",
        { journals: journals.map((j) => j.content) }
      );
      setPrompt(res.data.prompt || "No prompt returned.");
    } catch (err) {
      console.error("Prompt generation error:", err);
      setPrompt("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  return (
    <div
      className={`p-6 max-w-3xl mx-auto transition-all duration-300 rounded-lg shadow-md ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <Notebook className="w-6 h-6 text-indigo-500" />
        <h1 className="text-xl font-bold">Your Journal</h1>
      </div>

      <textarea
        className={`w-full p-4 mb-4 rounded-md border min-h-[120px] resize-none ${
          isDarkMode
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-gray-100 border-gray-300"
        }`}
        placeholder="Write your thoughts here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        onClick={saveJournal}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition mb-6"
      >
        Save Journal
      </button>

      <div className="mb-6">
        <button
          onClick={getReflectionPrompt}
          className="flex items-center gap-2 px-4 py-2 rounded bg-emerald-500 text-white hover:bg-emerald-600"
        >
          <Sparkles className="w-4 h-4" />
          Reflect & Get Prompt
        </button>
        {loading && (
          <p className="text-sm mt-2 text-gray-400">Generating prompt...</p>
        )}
        {prompt && (
          <p className="mt-4 text-emerald-600 italic border-l-4 pl-4 border-emerald-400">
            {prompt}
          </p>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Previous Entries</h2>
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
          {journals.map((j) => (
            <div
              key={j._id}
              className={`relative p-4 rounded-lg border shadow-sm group transition ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              <p className="text-xs text-gray-500 mb-2">
                {new Date(j.createdAt).toLocaleString()}
              </p>
              <p className="text-sm whitespace-pre-line">{j.content}</p>
              <button
                onClick={() => deleteJournal(j._id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-600"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Journal;
