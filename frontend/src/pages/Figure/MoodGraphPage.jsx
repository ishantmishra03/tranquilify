import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import { Bar } from 'react-chartjs-2';
import { toast } from 'react-hot-toast';

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

export const MoodGraphPage = () => {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading mood data...</p>;
  if (!moods.length) return <p className="text-center mt-10 text-gray-500">No mood data found.</p>;

  const labels = moods.map(m => m.mood);
  const counts = moods.map(m => m.count);
  const mostFrequentMood = moods.reduce((max, curr) => (curr.count > max.count ? curr : max), moods[0]);

  const data = {
    labels,
    datasets: [
      {
        label: 'Mood Frequency',
        data: counts,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 6,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        title: {
          display: true,
          text: 'Frequency',
          font: { size: 14, weight: 'bold' },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Moods',
          font: { size: 14, weight: 'bold' },
        },
      },
    },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Mood Frequency Overview',
        font: { size: 20, weight: 'bold' },
        padding: { top: 15, bottom: 20 },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-8 sm:py-8 flex flex-col">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="self-start text-sm sm:text-base px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-medium rounded-md shadow-sm transition mb-4"
      >
        ← Back
      </button>

      {/* Graph Card */}
      <div className="flex-1 bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6">
        <div className="h-[400px] sm:h-[550px]">
          <Bar data={data} options={options} />
        </div>
        <div className="mt-6 text-center text-base sm:text-lg text-gray-700 font-medium">
          Most Frequent Mood:{' '}
          <span className="text-emerald-600 font-semibold">
            {mostFrequentMood.mood}
          </span>{' '}
          ({mostFrequentMood.count} times)
        </div>
      </div>
    </div>
  );
};
