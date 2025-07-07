import { useEffect, useState } from "react";
import { Activity, TrendingDown } from "lucide-react";
import axios from "../../config/axios";
import { toast } from "react-hot-toast";

const getStressColor = (level) => {
  if (level >= 4) return "bg-red-500";
  if (level >= 3) return "bg-orange-500";
  if (level >= 2) return "bg-yellow-500";
  return "bg-green-500";
};

export const StressCard = () => {
  const [averageStress, setAverageStress] = useState(null);
  const [stressReduction, setStressReduction] = useState(0); // Optional: change logic if needed
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAverageStress = async () => {
      try {
        const res = await axios.get("/api/stress/user");
        if (res.data.success && res.data.stressData.length > 0) {
          const levels = res.data.stressData.map((entry) => entry.stressLevel);
          const avg = levels.reduce((a, b) => a + b, 0) / levels.length;
          setAverageStress(avg.toFixed(1));

          // Optional: compute % reduction compared to last week (if available)
          // For now just mock a 10% reduction:
          setStressReduction(10);
        } else {
          setAverageStress(0);
        }
      } catch (err) {
        console.error("Error fetching stress data:", err);
        toast.error("Failed to load stress level");
        setAverageStress(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAverageStress();
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Stress Level</h3>
            <p className="text-sm text-gray-600">This week</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-emerald-600">
          <TrendingDown className="w-4 h-4" />
          <span className="text-sm font-medium">
            -{stressReduction}%
          </span>
        </div>
      </div>
      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : (
        <div className="flex items-center space-x-2">
          <span className="text-3xl font-bold text-gray-900">
            {averageStress}
          </span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`w-2 h-6 rounded-full ${
                  averageStress >= level ? "bg-orange-400" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
