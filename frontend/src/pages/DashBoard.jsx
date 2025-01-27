import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  // Demo children data
  const children = [
    {
      id: 1,
      name: "Sarah Johnson",
      age: "4 years",
      image: "/default-child-avatar.png",
      lastActivity: "Reading Session",
      completedActivities: 12,
      upcomingMilestones: 3,
      stats: {
        physical: 75,
        cognitive: 80,
        social: 65,
        language: 70
      }
    },
    {
      id: 2,
      name: "Michael Johnson",
      age: "2 years",
      image: "/default-child-avatar.png",
      lastActivity: "Balance Practice",
      completedActivities: 8,
      upcomingMilestones: 5,
      stats: {
        physical: 60,
        cognitive: 65,
        social: 70,
        language: 55
      }
    }
  ];

  const handleChildClick = (childId) => {
    navigate(`/child/${childId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Children</h1>
        <button
          onClick={() => navigate('/create-child-profile')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Child
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {children.map((child) => (
          <div
            key={child.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleChildClick(child.id)}
          >
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <img
                  src={child.image}
                  alt={child.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">{child.name}</h2>
                  <p className="text-gray-500">{child.age}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Last Activity: {child.lastActivity}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Completed Activities</p>
                    <p className="text-2xl font-bold text-blue-600">{child.completedActivities}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Upcoming Milestones</p>
                    <p className="text-2xl font-bold text-purple-600">{child.upcomingMilestones}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700">Development Progress</h3>
                  <div className="space-y-2">
                    {Object.entries(child.stats).map(([area, progress]) => (
                      <div key={area}>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 capitalize">{area}</span>
                          <span className="text-gray-900">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/child/${child.id}/activities`);
                  }}
                >
                  View Activities →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;