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

export const StressGraph = () => {
  const [factors, setFactors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isDarkMode } = useAppContext(); 

  useEffect(() => {
    const fetchStressFactors = async () => {
      try {
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

  if (loading)
    return (
      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
        Loading stress data...
      </p>
    );

  if (!factors.length)
    return (
      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
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
        pointBackgroundColor: isDarkMode ? '#1f2937' : 'white',
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
          color: isDarkMode ? '#ddd' : '#333',
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
          color: isDarkMode ? '#ddd' : '#333',
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
        text: 'Stress Factors - Average Levels',
        font: { size: 16, weight: '600' },
        color: isDarkMode ? '#fff' : '#000',
        padding: { top: 10, bottom: 10 },
      },
    },
  };

  return (
    <div
      onClick={() => navigate('/stress-graph')}
      className={`cursor-pointer transition-all p-4 sm:p-6 rounded-xl mx-auto w-full max-w-4xl
        ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white hover:shadow-indigo-600/10' : 'bg-white border-gray-200 text-gray-900 hover:shadow-lg'} 
        border shadow-md`}
    >
      <div className="w-full overflow-x-auto">
        <div className="min-w-[300px] sm:min-w-0 h-[250px] sm:h-[300px] relative">
          <Line data={data} options={options} />
        </div>
      </div>
      <div className={`mt-4 text-center text-sm sm:text-base font-semibold 
        ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Highest Stress Factor:{' '}
        <span className="text-indigo-500">{maxStressFactor.factor}</span>{' '}
        (Level {maxStressFactor.level})
      </div>
    </div>
  );
};
