import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import { toast } from 'react-hot-toast';
import { Line } from 'react-chartjs-2';
import { useAppContext } from '../../context/AppContext'; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const StressGraphPage = () => {
  const [factors, setFactors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isDarkMode } = useAppContext();

  useEffect(() => {
    const fetchStressFactors = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/stress/pattern');
        if (res.data.success) {
          setFactors(res.data.factors);
        } else {
          toast.error('Failed to load stress factors');
        }
      } catch (error) {
        toast.error('Error fetching stress factors');
      } finally {
        setLoading(false);
      }
    };

    fetchStressFactors();
  }, []);

  if (loading) return (
    <p className={`text-center mt-10 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
      Loading stress data...
    </p>
  );

  if (!factors.length) return (
    <p className={`text-center mt-10 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
      No stress factors found.
    </p>
  );

  const labels = factors.map(f => f.factor);
  const stressLevels = factors.map(f => f.level);
  const maxStressFactor = factors.reduce(
    (max, curr) => (curr.level > max.level ? curr : max),
    factors[0]
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'Average Stress Level',
        data: stressLevels,
        fill: false,
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        pointBorderColor: 'rgba(99, 102, 241, 1)',
        pointBackgroundColor: '#fff',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 4,
        ticks: {
          stepSize: 1,
          color: isDarkMode ? '#ccc' : '#333',
        },
        title: {
          display: true,
          text: 'Stress Level',
          font: { size: 14, weight: 'bold' },
          color: isDarkMode ? '#eee' : '#111',
        },
      },
      x: {
        ticks: {
          color: isDarkMode ? '#ccc' : '#333',
        },
        title: {
          display: true,
          text: 'Stress Factors',
          font: { size: 14, weight: 'bold' },
          color: isDarkMode ? '#eee' : '#111',
        },
      },
    },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Detailed Stress Level Analysis',
        font: { size: 20, weight: 'bold' },
        color: isDarkMode ? '#fff' : '#000',
        padding: { top: 15, bottom: 20 },
      },
    },
  };

  return (
    <div className={`min-h-screen px-4 py-6 sm:px-8 sm:py-8 flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
     
      <button
        onClick={() => navigate(-1)}
        className={`self-start text-sm sm:text-base px-3 py-1.5 rounded-md shadow-sm transition mb-4 font-medium
          ${isDarkMode
            ? 'bg-indigo-900 hover:bg-indigo-800 text-indigo-200'
            : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'}`}
      >
        ← Back
      </button>

      
      <div className={`flex-1 rounded-xl shadow-md p-4 sm:p-6 border
        ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
      >
        <div className="h-[400px] sm:h-[550px]">
          <Line data={data} options={options} />
        </div>
        <div className={`mt-6 text-center text-base sm:text-lg font-medium
          ${isDarkMode ? 'text-indigo-300' : 'text-gray-700'}`}>
          Highest Stress Factor:{' '}
          <span className="text-indigo-500 font-semibold">
            {maxStressFactor.factor}
          </span>{' '}
          (Level {maxStressFactor.level})
        </div>
      </div>
    </div>
  );
};
