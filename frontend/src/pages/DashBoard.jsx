import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaChild, FaBirthdayCake, FaVenusMars, FaChartLine } from 'react-icons/fa';

const Dashboard = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch child profiles
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('/api/children/getAllChildProfiles', {
          headers: {
            Authorization: `${token}`,
          },
        });
        console.log(response);
        setChildren(response.data);
      } catch (error) {
        console.error('Error fetching child profiles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChildren();
  }, []);

  // Navigate to the child's activity calendar page
  const handleCardClick = (childId) => {
    navigate(`/child/${childId}/activities`);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
        <p className="text-gray-600 mt-2">Monitor and track your children's growth journey</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => (
            <div
              key={child._id}
              onClick={() => handleCardClick(child._id)}
              className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
            >
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                <div className="flex items-center space-x-3">
                  <FaChild className="text-white text-2xl" />
                  <h2 className="text-xl font-bold text-white">{child.name}</h2>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <FaBirthdayCake className="mr-2" />
                    <span>Born: {new Date(child.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaVenusMars className="mr-2" />
                    <span>Gender: {child.gender}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaChartLine className="mr-2" />
                    <span>View Growth Journey →</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Child Card */}
          <div
            onClick={() => navigate('/create-child-profile')}
            className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer border-2 border-dashed border-gray-300 flex items-center justify-center"
          >
            <div className="text-center p-8">
              <div className="bg-blue-100 rounded-full p-3 inline-block mb-4">
                <FaChild className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Add New Child</h3>
              <p className="text-gray-500 mt-2">Click to add a new child profile</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
