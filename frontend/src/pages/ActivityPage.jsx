import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ActivityCalendar from '../components/ActivityCalendar';
import FloatingButton from "../components/FloatingButtonApp";

const ActivityPage = () => {
  const { childId } = useParams();
  const [activities, setActivities] = useState([]);
  const [childName, setChildName] = useState('');
  const [showLogModal, setShowLogModal] = useState(false);
  const navigate = useNavigate();

  // Define fetchActivities function
  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`/api/children/getActivities/${childId}`, {
        headers: { Authorization: `${token}` },
      });
      setActivities(response.data.activities);
      setChildName(response.data.childName);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  // Fetch activities on component mount
  useEffect(() => {
    fetchActivities();
  }, [childId]);

  const onAddActivity = async (date, activityData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        '/api/children/addActivity',
        {
          childId,
          activity: activityData.activity,
          duration: parseInt(activityData.duration),
          date: date.toISOString()
        },
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update the activities state with the new activity
      setActivities(prevActivities => [...prevActivities, response.data.activity]);
      
      return response.data;
    } catch (error) {
      console.error('Error adding activity:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.message || 'Error adding activity');
      }
      throw error;
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/dashboard')}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
      >
        Back to Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-4">{childName}'s Activity Calendar</h1>
      <ActivityCalendar 
        activities={activities} 
        onAddActivity={onAddActivity}
        childId={childId} // Pass childId to calendar
      />
      <FloatingButton onClick={() => setShowLogModal(true)} />
    </div>
  );
};

export default ActivityPage;
