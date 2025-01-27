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
        const response = await axios.get(`/api/activities/${childId}`, {
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

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/dashboard')}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
      >
        Back to Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-4">{childName}'s Activity Calendar</h1>
      <ActivityCalendar activities={activities} />
      <FloatingButton onClick={() => setShowLogModal(true)} />
    </div>
  );
};

export default ActivityPage;
