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

  // Fetch activities for the child
  useEffect(() => {
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
    fetchActivities();
  }, [childId]);

  // onAddActivity function to handle adding activities
  const onAddActivity = async (selectedDate, newActivity) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        '/api/children/addActivity',
        {
          childId: childId,
          activity: newActivity.activity,
          duration: newActivity.duration,
          date: selectedDate,
        },
        {
          headers: { Authorization: `${token}` },
        }
      );
      if (response.status === 201) {
        // Fetch the updated activities after adding the new one
        const fetchActivities = async () => {
          try {
            const response = await axios.get(`/api/children/getActivities/${childId}`, {
              headers: { Authorization: `${token}` },
            });
            setActivities(response.data.activities);
            const analysisResponse = await axios.post(
              '/api/children/performAnalysis', // Adjust this endpoint according to your backend API
              { activities: response.data.activities },
              {
                headers: { Authorization: `${token}` },
              }
            );
            alert(`Analysis: ${analysisResponse.data.analysis}`);

          } catch (error) {
            console.error('Error fetching activities:', error);
          }
        };
        
        fetchActivities(); // Update the activities after adding the new one
      } else {
        alert('Failed to add activity');
      }
    } catch (error) {
      console.error('Error adding activity:', error);
      alert('Error adding activity');
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
      <ActivityCalendar activities={activities} onAddActivity={onAddActivity} />
      <FloatingButton onClick={() => setShowLogModal(true)} />
    </div>
  );
};

export default ActivityPage;
