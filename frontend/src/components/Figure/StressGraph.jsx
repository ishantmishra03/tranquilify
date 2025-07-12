import React, { useEffect, useState } from 'react';
import axios from '../../config/axios';
import { toast } from 'react-hot-toast';
import { Bar } from 'react-chartjs-2';
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

export const StressGraph = () => {
  const [factors, setFactors] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.error('Error fetching stress factors:', error);
        toast.error('Error fetching stress factors');
      } finally {
        setLoading(false);
      }
    };

    fetchStressFactors();
  }, []);

  if (loading) return <p>Loading stress data...</p>;
  if (!factors.length) return <p>No stress factors found.</p>;

  // Data for Chart.js
  const labels = factors.map(f => f.factor);
  const stressLevels = factors.map(f => f.level);

  // Find the factor with max stress level
  const maxStressFactor = factors.reduce((max, curr) => (curr.level > max.level ? curr : max), factors[0]);

  const data = {
    labels,
    datasets: [
      {
        label: 'Average Stress Level',
        data: stressLevels,
        backgroundColor: 'rgba(99, 102, 241, 0.7)', 
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
        max: 4,
        ticks: {
          stepSize: 1,
          callback: val => `${val}`, 
        },
        title: {
          display: true,
          text: 'Stress Level (0-4)',
          font: { size: 14, weight: 'bold' },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Stress Factors',
          font: { size: 14, weight: 'bold' },
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      title: {
        display: true,
        text: 'Stress Factors - Average Levels',
        font: { size: 18, weight: 'bold' },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <Bar data={data} options={options} />
      <div className="mt-4 text-center text-gray-700 font-semibold">
        Highest Stress Factor: <span className="text-indigo-600">{maxStressFactor.factor}</span> (Level {maxStressFactor.level})
      </div>
    </div>
  );
};
