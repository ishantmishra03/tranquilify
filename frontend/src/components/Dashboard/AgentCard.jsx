import { Bot } from "lucide-react";
// import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const AgentCard = () => {
  // const navigate = useNavigate();
  const { isDarkMode } = useAppContext();

  return (
    <div
      // onClick={() => navigate("/agent")}
      onClick={() => toast.success("Feature is temporarily disabled")}
      className={`cursor-pointer p-6 rounded-2xl border group transition-all duration-300 shadow-lg hover:shadow-xl ${
        isDarkMode
          ? "bg-gray-900 border-gray-700 text-white hover:border-sky-600"
          : "bg-white border-gray-200 text-gray-900 hover:border-sky-500"
      }`}
    >
      <div className="flex items-center space-x-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
            isDarkMode
              ? "bg-gradient-to-r from-sky-800 to-emerald-800"
              : "bg-gradient-to-r from-sky-500 to-emerald-500"
          }`}
        >
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">AI Support Agent</h3>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Talk to our smart AI helper for your wellness journey
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
