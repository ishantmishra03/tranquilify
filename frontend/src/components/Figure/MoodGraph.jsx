import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import { Bar } from 'react-chartjs-2';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext'; 

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const MoodGraph = () => {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isDarkMode } = useAppContext(); 

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const res = await axios.get('/api/mood/pattern');
        if (res.data.success) {
          setMoods(res.data.moods);
        } else {
          toast.error('Failed to load mood data');
        }
      } catch (err) {
        toast.error('Error fetching mood data');
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, []);

  if (loading) {
    return (
      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
        Loading mood data...
      </p>
    );
  }

  if (!moods.length) {
    return (
      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
        No mood data found.
      </p>
    );
  }

  const labels = moods.map(m => m.mood);
  const counts = moods.map(m => m.count);
  const mostFrequentMood = moods.reduce(
    (max, curr) => (curr.count > max.count ? curr : max),
    moods[0]
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'Mood Frequency',
        data: counts,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 4,
        barThickness: 28,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: isDarkMode ? '#ccc' : '#444' },
        title: {
          display: true,
          text: 'Frequency',
          font: { size: 13, weight: 'bold' },
          color: isDarkMode ? '#ccc' : '#222',
        },
      },
      x: {
        ticks: { color: isDarkMode ? '#ccc' : '#444' },
        title: {
          display: true,
          text: 'Moods',
          font: { size: 13, weight: 'bold' },
          color: isDarkMode ? '#ccc' : '#222',
        },
      },
    },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Mood Frequency Overview',
        font: { size: 16, weight: '600' },
        color: isDarkMode ? '#fff' : '#000',
        padding: { top: 10, bottom: 10 },
      },
    },
  };

  return (
    <div
      onClick={() => navigate('/mood-graph')}
      className={`cursor-pointer transition-all p-4 sm:p-6 rounded-xl mx-auto w-full max-w-xl 
        ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white hover:shadow-emerald-600/10' : 'bg-white border-gray-200 text-gray-900 hover:shadow-lg'} 
        border shadow-md`}
    >
      <div className="relative h-[260px] sm:h-[300px]">
        <Bar data={data} options={options} />
      </div>
      <div className={`mt-4 text-center text-sm sm:text-base font-medium 
        ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Most Frequent Mood:{' '}
        <span className="text-emerald-500 font-semibold">
          {mostFrequentMood.mood}
        </span>{' '}
        ({mostFrequentMood.count} times)
      </div>
    </div>
  );
};
