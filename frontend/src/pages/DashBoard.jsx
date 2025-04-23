import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaChild, FaBirthdayCake, FaVenusMars, FaChartLine, FaRuler, FaWeight, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const Dashboard = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingChild, setEditingChild] = useState(null);
  const [measurements, setMeasurements] = useState({ height: 0, weight: 0 });
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
    if (!editingChild) {
      navigate(`/child/${childId}/activities`);
    }
  };

  // Start editing a child's measurements
  const handleEditClick = (e, child) => {
    e.stopPropagation(); // Prevent card click
    setEditingChild(child._id);
    setMeasurements({ height: child.height, weight: child.weight });
  };

  // Cancel editing
  const handleCancelEdit = (e) => {
    e.stopPropagation(); // Prevent card click
    setEditingChild(null);
  };

  // Handle input change
  const handleMeasurementChange = (e) => {
    const { name, value } = e.target;
    setMeasurements(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save updated measurements
  const handleSaveMeasurements = async (e, childId) => {
    e.stopPropagation(); // Prevent card click

    try {
      const token = localStorage.getItem('authToken');
      await axios.post('/api/children/updateMeasurements',
        {
          childId,
          height: measurements.height,
          weight: measurements.weight
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      // Update the local state with new measurements
      setChildren(prevChildren =>
        prevChildren.map(child =>
          child._id === childId
            ? { ...child, height: measurements.height, weight: measurements.weight }
            : child
        )
      );

      setEditingChild(null);
    } catch (error) {
      console.error('Error updating measurements:', error);
      alert('Failed to update measurements. Please try again.');
    }
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

                  {editingChild === child._id ? (
                    <div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <FaRuler className="mr-2" />
                        <input
                          type="number"
                          name="height"
                          value={measurements.height}
                          onChange={handleMeasurementChange}
                          className="border rounded p-1 w-20 text-center mr-1"
                          min="1"
                          step="0.1"
                          onClick={e => e.stopPropagation()}
                        />
                        <span>cm</span>
                      </div>

                      <div className="flex items-center text-gray-600 mb-3">
                        <FaWeight className="mr-2" />
                        <input
                          type="number"
                          name="weight"
                          value={measurements.weight}
                          onChange={handleMeasurementChange}
                          className="border rounded p-1 w-20 text-center mr-1"
                          min="0.1"
                          step="0.1"
                          onClick={e => e.stopPropagation()}
                        />
                        <span>kg</span>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => handleSaveMeasurements(e, child._id)}
                          className="flex items-center bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          <FaSave className="mr-1" /> Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                        >
                          <FaTimes className="mr-1" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center text-gray-600">
                        <FaRuler className="mr-2" />
                        <span>Height: {child.height} cm</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaWeight className="mr-2" />
                        <span>Weight: {child.weight} kg</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-gray-600">
                          <FaChartLine className="mr-2" />
                          <span>View Growth Journey</span>
                        </div>
                        <button
                          onClick={(e) => handleEditClick(e, child)}
                          className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-200"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </>
                  )}
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
