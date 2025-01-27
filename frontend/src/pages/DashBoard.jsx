import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [children, setChildren] = useState([]);
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
      }
    };
    fetchChildren();
  }, []);

  // Navigate to the child's activity calendar page
  const handleCardClick = (childId) => {
    navigate(`/child/${childId}/activities`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Child Profiles</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {children.map((child) => (
          <div
            key={child._id}
            className="bg-white shadow-lg rounded-lg p-4 cursor-pointer hover:shadow-xl"
            onClick={() => handleCardClick(child._id)}
          >
            <h2 className="text-xl font-bold">{child.name}</h2>
            <p>Date of Birth: {new Date(child.dateOfBirth).toLocaleDateString()}</p>
            <p>Gender: {child.gender}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
