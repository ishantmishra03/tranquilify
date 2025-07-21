import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DailyQuotes() {
  const { isDarkMode } = useAppContext();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("dailyQuotes");
    if (stored) {
      const { data, timestamp } = JSON.parse(stored);
      const now = Date.now();

      if (now - timestamp < 86400000 && data && data.length === 3) {
        setQuotes(data);
        return;
      }
    }
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "https://api.quotable.io/quotes?tags=happiness|life&limit=3"
      );
      if (!res.ok) {
        toast.error("Failed to fetch quotes");
        setError("Failed to fetch quotes");
        setLoading(false);
        return;
      }
      const json = await res.json();
      const fetchedQuotes = json.results.map((q) => ({
        _id: q._id,
        content: q.content,
        author: q.author,
      }));
      setQuotes(fetchedQuotes);
      localStorage.setItem(
        "dailyQuotes",
        JSON.stringify({ data: fetchedQuotes, timestamp: Date.now() })
      );
    } catch (e) {
      setError("Unable to load quotes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const prevQuote = () => {
    setIndex((i) => (i === 0 ? quotes.length - 1 : i - 1));
  };

  const nextQuote = () => {
    setIndex((i) => (i === quotes.length - 1 ? 0 : i + 1));
  };

  const bgGradient = isDarkMode
    ? "bg-gradient-to-r from-sky-800 to-emerald-900 text-gray-100 shadow-lg shadow-black/50"
    : "bg-gradient-to-r from-sky-400 to-emerald-400 text-gray-900 shadow-md shadow-green-300";

  return (
    <div
      className={`max-w-md mx-auto p-6 rounded-2xl ${bgGradient} flex flex-col items-center`}
      role="region"
      aria-label="Daily motivational quotes slider"
    >
      <h2 className="text-xl font-semibold mb-6 text-center">Daily Inspiration</h2>

      {loading && (
        <p className="text-center text-sm italic text-sky-200">Loading quotes...</p>
      )}

      {error && (
        <p className="text-center text-sm text-red-400 mb-4">{error}</p>
      )}

      {!loading && !error && quotes.length > 0 && (
        <>
          <blockquote className="italic text-lg leading-relaxed text-center mb-4 px-4">
            “{quotes[index].content}”
          </blockquote>
          <footer className="text-right font-semibold text-sm text-sky-300 w-full mb-6">
            — {quotes[index].author}
          </footer>

          <div className="flex space-x-8">
            <button
              onClick={prevQuote}
              aria-label="Previous quote"
              className="p-2 rounded-full bg-white/30 hover:bg-white/50 transition"
            >
              <ChevronLeft
                className={`${isDarkMode ? "text-white" : "text-gray-900"}`}
                size={28}
              />
            </button>
            <button
              onClick={nextQuote}
              aria-label="Next quote"
              className="p-2 rounded-full bg-white/30 hover:bg-white/50 transition"
            >
              <ChevronRight
                className={`${isDarkMode ? "text-white" : "text-gray-900"}`}
                size={28}
              />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
