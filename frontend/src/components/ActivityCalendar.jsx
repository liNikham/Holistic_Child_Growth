import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaRunning, FaClock, FaPlus } from 'react-icons/fa';

const ActivityCalendar = ({ activities, onAddActivity }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalData, setModalData] = useState([]);
  const [newActivity, setNewActivity] = useState({ activity: '', duration: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  // Add function to check if date is in the future
  const isFutureDate = (date) => {
    return new Date(date) > new Date(new Date().setHours(23, 59, 59, 999));
  };

  // Custom tile disabling for Calendar
  const tileDisabled = ({ date }) => {
    return isFutureDate(date);
  };

  // Update handleDateChange to prevent future dates
  const handleDateChange = (date) => {
    if (isFutureDate(date)) {
      return;
    }
    setSelectedDate(date);
    // Filter activities by the selected date
    const filteredActivities = activities.filter(
      (activity) => new Date(activity.date).toDateString() === date.toDateString()
    );
    setModalData(filteredActivities);
  };

  const handleAddActivity = async () => {
    if (newActivity.activity && newActivity.duration) {
      try {
        const response = await onAddActivity(selectedDate, newActivity);

        // Create a new activity object with the response data
        const addedActivity = {
          ...response.activity,
          _id: response.activity._id || Date.now() // Use response ID or temporary ID
        };

        // Update the local modalData state with the new activity
        setModalData(prevData => [...prevData, addedActivity]);

        // Clear form
        setNewActivity({ activity: '', duration: '' });
        setShowAddForm(false);
      } catch (error) {
        console.error('Error adding activity:', error);
        alert(error.message || 'Error adding activity');
      }
    } else {
      alert('Please fill in both activity and duration');
    }
  };

  // Custom tile content to show activity indicators
  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayActivities = activities.filter(
        (activity) => new Date(activity.date).toDateString() === date.toDateString()
      );
      if (dayActivities.length > 0) {
        return (
          <div className="flex flex-col items-center">
            <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-1"></div>
            <div className="text-xs text-gray-500 mt-1">{dayActivities.length}</div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="activity-calendar">
      <style>
        {`
          .activity-calendar .react-calendar {
            width: 100%;
            border: none;
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            font-family: system-ui, -apple-system, sans-serif;
          }
          .activity-calendar .react-calendar__tile {
            height: 100px;
            padding: 1rem 0.5rem;
            position: relative;
          }
          .activity-calendar .react-calendar__tile:enabled:hover,
          .activity-calendar .react-calendar__tile:enabled:focus {
            background-color: #f3f4f6;
          }
          .activity-calendar .react-calendar__tile--active {
            background-color: #e5edff !important;
          }
        `}
      </style>

      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileContent={getTileContent}
        tileDisabled={tileDisabled}
        maxDate={new Date()}
        className="mb-4"
      />

      {/* Modal */}
      {selectedDate && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedDate(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Activities on {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Existing Activities */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-700">Today's Activities</h4>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                >
                  <FaPlus className="text-sm" />
                  <span>Add Activity</span>
                </button>
              </div>

              {modalData.length > 0 ? (
                <div className="space-y-3">
                  {modalData.map((activity, index) => (
                    <div
                      key={activity._id || index}
                      className="bg-gray-50 p-4 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <FaRunning className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{activity.activity}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <FaClock className="mr-1" />
                            <span>{activity.duration} minutes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No activities recorded for this date</p>
              )}
            </div>

            {/* Add Activity Form */}
            {showAddForm && (
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">Add New Activity</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      value={newActivity.activity}
                      onChange={(e) =>
                        setNewActivity({ ...newActivity, activity: e.target.value })
                      }
                      placeholder="Enter activity name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      value={newActivity.duration}
                      onChange={(e) =>
                        setNewActivity({ ...newActivity, duration: e.target.value })
                      }
                      placeholder="Enter duration"
                    />
                  </div>
                  <button
                    onClick={handleAddActivity}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add Activity
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityCalendar;
