import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBrain, FaChartLine, FaLightbulb, FaBalanceScale, FaRegChartBar } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, ArcElement } from 'chart.js';
import { Bar, Radar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Define recommended durations for each category
const RECOMMENDED_DURATIONS = {
  physical: 60, // 60 minutes per day
  learning: 45, // 45 minutes per day
  social: 30,   // 30 minutes per day
  creative: 30  // 30 minutes per day
};

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Development Progress'
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${context.dataset.label}: ${Math.round(context.raw)}%`;
        }
      }
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

const radarChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      angleLines: {
        display: true
      },
      suggestedMin: 0,
      suggestedMax: 100
    }
  },
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Development Balance'
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${context.dataset.label}: ${Math.round(context.raw)}%`;
        }
      }
    }
  }
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: true,
      text: 'Development Distribution'
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const value = context.raw;
          const sum = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = Math.round((value / sum) * 100);
          return `${context.label}: ${percentage}% (${value} min)`;
        }
      }
    }
  }
};

const ActivityRecommendations = ({ childId, activities }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalActivityDurations, setTotalActivityDurations] = useState({});

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
      // Calculate progress percentages
      const progressData = {
        physical: calculateCategoryProgress('physical'),
        cognitive: calculateCategoryProgress('learning'),
        social: calculateCategoryProgress('social'),
        creative: calculateCategoryProgress('creative')
      };

      // Calculate total durations for each category
      const durationData = {
        physical: calculateCategoryDuration('physical'),
        cognitive: calculateCategoryDuration('learning'),
        social: calculateCategoryDuration('social'),
        creative: calculateCategoryDuration('creative')
      };

      setProgress(progressData);
      setTotalActivityDurations(durationData);
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

  const calculateCategoryDuration = (category) => {
    if (!activities) return 0;

    const categoryActivities = activities.filter(a => a.category === category);
    if (categoryActivities.length === 0) return 0;

    return categoryActivities.reduce((sum, a) => sum + (parseInt(a.duration) || 0), 0);
  };

  const barChartData = {
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

  const radarChartData = {
    labels: ['Physical', 'Cognitive', 'Social', 'Creative'],
    datasets: [{
      label: 'Current Progress',
      data: [
        progress.physical || 0,
        progress.cognitive || 0,
        progress.social || 0,
        progress.creative || 0
      ],
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(54, 162, 235, 1)',
      pointRadius: 4
    }]
  };

  const doughnutChartData = {
    labels: ['Physical', 'Cognitive', 'Social', 'Creative'],
    datasets: [{
      label: 'Time Distribution',
      data: [
        totalActivityDurations.physical || 0,
        totalActivityDurations.cognitive || 0,
        totalActivityDurations.social || 0,
        totalActivityDurations.creative || 0
      ],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)'
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
          {/* Progress Charts Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaChartLine className="mr-2 text-blue-600" />
              Development Progress
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Bar Chart */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Progress by Category</h4>
                <div className="h-64">
                  <Bar data={barChartData} options={barChartOptions} />
                </div>
              </div>

              {/* Radar Chart */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Development Balance</h4>
                <div className="h-64">
                  <Radar data={radarChartData} options={radarChartOptions} />
                </div>
              </div>

              {/* Doughnut Chart */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Activity Distribution</h4>
                <div className="h-64">
                  <Doughnut data={doughnutChartData} options={doughnutOptions} />
                </div>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              {Object.entries(RECOMMENDED_DURATIONS).map(([category, target]) => (
                <div key={category} className="bg-white p-4 rounded-lg shadow">
                  <h4 className="text-sm font-medium text-gray-500 capitalize">{category}</h4>
                  <div className="flex items-end justify-between mt-2">
                    <div>
                      <span className="text-2xl font-bold text-gray-800">
                        {Math.round(progress[category] || 0)}%
                      </span>
                      <p className="text-xs text-gray-500 mt-1">of recommended</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-700">
                        {totalActivityDurations[category] || 0}/{target}
                      </span>
                      <p className="text-xs text-gray-500">minutes</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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