import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBrain, FaChartLine, FaLightbulb } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define recommended durations for each category
const RECOMMENDED_DURATIONS = {
  physical: 60, // 60 minutes per day
  learning: 45, // 45 minutes per day
  social: 30,   // 30 minutes per day
  creative: 30  // 30 minutes per day
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Development Progress'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      title: {
        display: true,
        text: 'Progress (%)'
      }
    }
  }
};

const ActivityRecommendations = ({ childId, activities }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendations();
    if (activities?.length > 0) {
      analyzeProgress();
    }
  }, [childId, activities]);

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`/api/children/getRecommendations/${childId}`, {
        headers: { Authorization: token }
      });
      setRecommendations(response.data.recommendations || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('Failed to load recommendations');
    }
  };

  const getRecommendedDuration = (category) => {
    return RECOMMENDED_DURATIONS[category] || 30; // Default to 30 minutes if category not found
  };

  const analyzeProgress = () => {
    try {
      const progressData = {
        physical: calculateCategoryProgress('physical'),
        cognitive: calculateCategoryProgress('learning'),
        social: calculateCategoryProgress('social'),
        creative: calculateCategoryProgress('creative')
      };
      setProgress(progressData);
    } catch (error) {
      console.error('Error analyzing progress:', error);
      setError('Failed to analyze progress');
    } finally {
      setLoading(false);
    }
  };

  const calculateCategoryProgress = (category) => {
    if (!activities) return 0;
    
    const categoryActivities = activities.filter(a => a.category === category);
    if (categoryActivities.length === 0) return 0;
    
    const totalDuration = categoryActivities.reduce((sum, a) => sum + (parseInt(a.duration) || 0), 0);
    const recommendedDuration = getRecommendedDuration(category);
    return Math.min((totalDuration / recommendedDuration) * 100, 100); // Cap at 100%
  };

  const chartData = {
    labels: ['Physical', 'Cognitive', 'Social', 'Creative'],
    datasets: [{
      label: 'Development Progress (%)',
      data: [
        progress.physical || 0,
        progress.cognitive || 0,
        progress.social || 0,
        progress.creative || 0
      ],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 1
    }]
  };

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <FaBrain className="mr-2 text-blue-600" />
        Smart Recommendations
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Progress Chart */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Development Progress</h3>
            <Bar data={chartData} options={chartOptions} height={200} />
          </div>

          {/* Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FaLightbulb className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{rec.title}</h4>
                    <p className="text-gray-600 text-sm mt-1">{rec.description}</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <FaChartLine className="mr-1" />
                      <span>Recommended duration: {rec.duration} minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityRecommendations; 