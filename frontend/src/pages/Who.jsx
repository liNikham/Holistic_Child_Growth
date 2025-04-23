import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChild, FaChartLine, FaRuler, FaWeight, FaBalanceScale } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Who = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [standardType, setStandardType] = useState('wfa');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all children
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('/api/children/getAllChildProfiles', {
          headers: {
            Authorization: `${token}`,
          },
        });
        setChildren(response.data);
      } catch (error) {
        console.error('Error fetching children:', error);
        setError('Could not load children profiles');
      }
    };
    fetchChildren();
  }, []);

  // Fetch WHO standard data when child or standard type changes
  useEffect(() => {
    if (!selectedChild) return;

    const fetchWhoStandardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        let endpoint;

        switch (standardType) {
          case 'wfa':
            endpoint = `/api/children/weight_for_age/${selectedChild._id}`;
            break;
          case 'wfh':
            endpoint = `/api/children/weight_for_height/${selectedChild._id}`;
            break;
          case 'lhfa':
            endpoint = `/api/children/length_height_for_age/${selectedChild._id}`;
            break;
          case 'bfa':
            endpoint = `/api/children/bmi_for_age/${selectedChild._id}`;
            break;
          default:
            endpoint = `/api/children/weight_for_age/${selectedChild._id}`;
        }

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `${token}`,
          },
        });

        prepareChartData(response.data);
      } catch (error) {
        console.error('Error fetching WHO data:', error);
        setError(
          error.response?.data?.error ||
          'Could not load growth standards data. This might happen if the child\'s age is outside the range for this measurement type.'
        );
        setChartData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWhoStandardData();
  }, [selectedChild, standardType]);

  // Prepare chart data based on the received WHO data
  const prepareChartData = (data) => {
    if (!data) return;

    const labels = ['Child'];
    const childValue = data.results.zScore;

    // Get the reference ranges
    const ranges = data.referenceRanges;

    // Convert to chart data
    const chartData = {
      labels,
      datasets: [
        {
          label: 'Child',
          data: [childValue],
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          borderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
        {
          label: 'Severely Low (-3SD)',
          data: [ranges.SD3neg],
          borderColor: 'rgba(255, 99, 132, 0.8)',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          borderWidth: 1,
          pointRadius: 0,
        },
        {
          label: 'Low (-2SD)',
          data: [ranges.SD2neg],
          borderColor: 'rgba(255, 159, 64, 0.8)',
          backgroundColor: 'rgba(255, 159, 64, 0.1)',
          borderWidth: 1,
          pointRadius: 0,
        },
        {
          label: 'Median',
          data: [ranges.median],
          borderColor: 'rgba(75, 192, 192, 0.8)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          borderWidth: 2,
          pointRadius: 0,
        },
        {
          label: 'High (+2SD)',
          data: [ranges.SD2],
          borderColor: 'rgba(255, 159, 64, 0.8)',
          backgroundColor: 'rgba(255, 159, 64, 0.1)',
          borderWidth: 1,
          pointRadius: 0,
        },
        {
          label: 'Severely High (+3SD)',
          data: [ranges.SD3],
          borderColor: 'rgba(255, 99, 132, 0.8)',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          borderWidth: 1,
          pointRadius: 0,
        },
      ]
    };

    setChartData({ chartData, standardData: data });
  };

  // Handle child selection
  const handleChildSelect = (child) => {
    setSelectedChild(child);
    setError(null);
  };

  // Render the interpretation of the growth data
  const renderInterpretation = () => {
    if (!chartData?.standardData?.results) return null;

    const { results } = chartData.standardData;
    const { zScore, percentile, status, severity, recommendation, details, nutritionalStatus } = results;

    let statusColor = 'text-green-600';
    if (zScore < -2 || zScore > 2) {
      statusColor = 'text-red-600';
    } else if (zScore < -1 || zScore > 1) {
      statusColor = 'text-yellow-600';
    }

    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Growth Assessment</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="mb-2">
              <strong>Z-Score:</strong> <span className={statusColor}>{zScore}</span>
            </p>
            <p className="mb-2">
              <strong>Percentile:</strong> {percentile}
            </p>
            {status && (
              <p className="mb-2">
                <strong>Status:</strong> <span className={statusColor}>{status}</span>
              </p>
            )}
            {severity && (
              <p className="mb-2">
                <strong>Severity:</strong> <span className={statusColor}>{severity}</span>
              </p>
            )}
            {nutritionalStatus && (
              <p className="mb-2">
                <strong>Nutritional Status:</strong> <span className={statusColor}>{nutritionalStatus}</span>
              </p>
            )}
          </div>

          <div>
            {recommendation && (
              <div className="mb-3">
                <strong>Recommendations:</strong>
                <p className="mt-1 text-gray-700">{recommendation}</p>
              </div>
            )}
            {details && (
              <div>
                <strong>Details:</strong>
                <p className="mt-1 text-gray-700">{details}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Get title based on standard type
  const getTitle = () => {
    switch (standardType) {
      case 'wfa': return 'Weight for Age';
      case 'wfh': return 'Weight for Height';
      case 'lhfa': return 'Length/Height for Age';
      case 'bfa': return 'BMI for Age';
      default: return 'Growth Standards';
    }
  };

  // Get description based on standard type
  const getDescription = () => {
    switch (standardType) {
      case 'wfa':
        return 'Weight-for-age shows how a child\'s weight compares to the typical weight of children of the same age.';
      case 'wfh':
        return 'Weight-for-height shows if a child has an appropriate weight compared to their height, regardless of age.';
      case 'lhfa':
        return 'Length/Height-for-age shows if a child is growing in height/length as expected for their age.';
      case 'bfa':
        return 'BMI-for-age uses the Body Mass Index (weight divided by height squared) to assess if a child has a healthy weight.';
      default:
        return 'WHO growth standards help assess if children are growing well.';
    }
  };

  // Get icon based on standard type
  const getIcon = () => {
    switch (standardType) {
      case 'wfa': return <FaWeight className="text-blue-500 text-2xl" />;
      case 'wfh': return <FaBalanceScale className="text-purple-500 text-2xl" />;
      case 'lhfa': return <FaRuler className="text-green-500 text-2xl" />;
      case 'bfa': return <FaChild className="text-orange-500 text-2xl" />;
      default: return <FaChartLine className="text-blue-500 text-2xl" />;
    }
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: `${getTitle()} - Z-Score Chart`,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.parsed.y;
            return `Z-Score: ${value.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Z-Score',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">WHO Growth Standards</h1>
        <p className="text-gray-600 mt-2">Track your child's growth compared to World Health Organization standards</p>
      </div>

      {/* Child selection */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Select a Child</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {children.map((child) => (
            <div
              key={child._id}
              onClick={() => handleChildSelect(child)}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${selectedChild?._id === child._id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
            >
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 rounded-full p-3 mb-2">
                  <FaChild className="text-blue-600 text-xl" />
                </div>
                <h3 className="font-medium text-center">{child.name}</h3>
                <p className="text-sm text-gray-500 text-center">
                  {new Date(child.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedChild && (
        <>
          {/* Standard type selection */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Select Growth Standard</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => setStandardType('wfa')}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${standardType === 'wfa'
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
              >
                <div className="flex items-center mb-2">
                  <FaWeight className="text-blue-500 text-xl mr-2" />
                  <h3 className="font-medium">Weight for Age</h3>
                </div>
                <p className="text-sm text-gray-500">Assesses if a child's weight is appropriate for their age</p>
              </div>

              <div
                onClick={() => setStandardType('wfh')}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${standardType === 'wfh'
                  ? 'border-purple-500 bg-purple-50 shadow-md'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  }`}
              >
                <div className="flex items-center mb-2">
                  <FaBalanceScale className="text-purple-500 text-xl mr-2" />
                  <h3 className="font-medium">Weight for Height</h3>
                </div>
                <p className="text-sm text-gray-500">Evaluates if weight is appropriate for current height</p>
              </div>

              <div
                onClick={() => setStandardType('lhfa')}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${standardType === 'lhfa'
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                  }`}
              >
                <div className="flex items-center mb-2">
                  <FaRuler className="text-green-500 text-xl mr-2" />
                  <h3 className="font-medium">Height for Age</h3>
                </div>
                <p className="text-sm text-gray-500">Shows if a child is growing in height as expected</p>
              </div>

              <div
                onClick={() => setStandardType('bfa')}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${standardType === 'bfa'
                  ? 'border-orange-500 bg-orange-50 shadow-md'
                  : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                  }`}
              >
                <div className="flex items-center mb-2">
                  <FaChild className="text-orange-500 text-xl mr-2" />
                  <h3 className="font-medium">BMI for Age</h3>
                </div>
                <p className="text-sm text-gray-500">Body Mass Index comparison with age-based standards</p>
              </div>
            </div>
          </div>

          {/* Results display */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              {getIcon()}
              <h2 className="text-xl font-semibold ml-2">{getTitle()}</h2>
            </div>

            <p className="text-gray-600 mb-6">{getDescription()}</p>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            ) : chartData ? (
              <>
                <div className="h-80 mb-6">
                  <Line options={options} data={chartData.chartData} />
                </div>

                {renderInterpretation()}

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">How to read this chart</h3>
                  <p className="text-gray-700 mb-3">
                    The chart shows your child's measurement as a Z-score, which compares them to WHO standards:
                  </p>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    <li>A Z-score of 0 means the child is exactly at the median (average)</li>
                    <li>A Z-score between -2 and +2 is generally considered within the normal range</li>
                    <li>A Z-score below -2 may indicate undernutrition or growth faltering</li>
                    <li>A Z-score above +2 may indicate overweight or other growth concerns</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                <FaChartLine className="text-gray-400 text-4xl mb-3" />
                <p className="text-gray-500">Select a child and growth standard to view results</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Who;