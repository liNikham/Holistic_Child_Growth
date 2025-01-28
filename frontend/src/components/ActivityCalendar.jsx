import React, { useState } from 'react';
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css';

const ActivityCalendar = ({ activities, onAddActivity }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalData, setModalData] = useState([]);
  const [newActivity, setNewActivity] = useState({ activity: '', duration: '' });

  const handleDateChange = (date) => {
    setSelectedDate(date);

    // Filter activities by the selected date
    const filteredActivities = activities.filter(
      (activity) => new Date(activity.date).toDateString() === date.toDateString()
    );

    setModalData(filteredActivities);
  };
  const handleAddActivity = async () => {
    if (newActivity.activity && newActivity.duration) {
      console.log(newActivity);
      // Call the parent function to add the activity
      await onAddActivity(selectedDate, newActivity);
      setNewActivity({ activity: '', duration: '' });
      setSelectedDate(null); // Close modal after adding
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
        className="mb-4"
      />

      {/* Activity Details Modal */}
      {selectedDate && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedDate(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Add Activity on {selectedDate.toLocaleDateString('en-US')}
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

            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Activity</label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  value={newActivity.activity}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, activity: e.target.value })
                  }
                  placeholder="Enter activity"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Duration</label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  value={newActivity.duration}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, duration: e.target.value })
                  }
                  placeholder="Enter duration in minutes"
                />
              </div>
              <button
                className="mt-4 text-white bg-blue-500 hover:bg-blue-600 rounded-md px-4 py-2"
                onClick={handleAddActivity}
              >
                Add Activity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityCalendar;
