import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { MonitorPlay } from "lucide-react";

export const AmbientCard = () => {
  const { isDarkMode } = useAppContext();
  const navigate = useNavigate();

  const containerClasses = `rounded-2xl p-6 shadow-lg border cursor-pointer flex flex-col items-center justify-center space-y-4 ${
    isDarkMode
      ? "bg-gray-900 border-gray-700 text-gray-200"
      : "bg-white border-gray-100 text-gray-900"
  }`;

  const iconClasses = `w-8 h-8 ${
    isDarkMode ? "text-emerald-400" : "text-emerald-600"
  }`;

  const buttonClasses = `inline-flex items-center space-x-2 px-4 py-1.5 rounded-lg shadow-md transition text-sm font-medium ${
    isDarkMode
      ? "bg-gradient-to-r from-emerald-700 to-sky-700 text-white hover:from-emerald-600 hover:to-sky-600"
      : "bg-gradient-to-r from-emerald-400 to-sky-400 text-white hover:from-emerald-500 hover:to-sky-500"
  }`;

  return (
    <div
      className={containerClasses}
      onClick={() => navigate("/ambient-room")}
      role="button"
      tabIndex={0}
    >
      <MonitorPlay className={iconClasses} />
      <h3 className="text-xl font-semibold">Ambient Focus Mode</h3>
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate("/ambient-room");
        }}
        className={buttonClasses}
        type="button"
        aria-label="Go to Ambient Focus Mode"
      >
        Enter Room
      </button>
    </div>
  );
};
