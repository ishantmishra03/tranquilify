import { useEffect, useState } from 'react';
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

export const MoodGraph = () => {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/mood/pattern');
        if (res.data.success) {
          setMoods(res.data.moods);
        } else {
          toast.error('Failed to load mood data');
        }
      } catch (err) {
        console.error('Error fetching mood data:', err);
        toast.error('Error fetching mood data');
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, []);

  if (loading) return <p>Loading mood data...</p>;
  if (!moods.length) return <p>No mood data found.</p>;

  const labels = moods.map(m => m.mood);
  const counts = moods.map(m => m.count);

  const mostFrequentMood = moods.reduce((max, curr) => (curr.count > max.count ? curr : max), moods[0]);

  const data = {
    labels,
    datasets: [
      {
        label: 'Mood Frequency',
        data: counts,
        backgroundColor: 'rgba(34, 197, 94, 0.7)', // Tailwind emerald-500
        borderRadius: 6,
        barPercentage: 0.6,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
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
        font: { size: 18, weight: 'bold' },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <Bar data={data} options={options} />
      <div className="mt-4 text-center text-gray-700 font-semibold">
        Most Frequent Mood: <span className="text-emerald-600">{mostFrequentMood.mood}</span> ({mostFrequentMood.count} times)
      </div>
    </div>
  );
};
