import React, { useEffect, useState } from 'react';
import ActivityRecommendations from '../components/ActivityRecommendations';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RecommendationsPage = () => {
  const { childId } = useParams();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`/api/children/getActivities/${childId}`, {
          headers: { Authorization: token }
        });
        setActivities(response.data.activities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, [childId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Smart Recommendations</h1>
      <ActivityRecommendations 
        childId={childId} 
        activities={activities} 
      />
    </div>
  );
};

export default RecommendationsPage; 