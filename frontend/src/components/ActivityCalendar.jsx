import React, { useState } from 'react';
import Calendar from 'react-calendar'; // Install with `npm install react-calendar`
import 'react-calendar/dist/Calendar.css'; // Import calendar styles

const ActivityCalendar = ({ activities }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalData, setModalData] = useState([]);

  const handleDateChange = (date) => {
    setSelectedDate(date);

    // Filter activities by the selected date
    const filteredActivities = activities.filter(
      (activity) => new Date(activity.date).toDateString() === date.toDateString()
    );

    setModalData(filteredActivities);
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

  // Custom tile className for styling
  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const hasActivities = activities.some(
        (activity) => new Date(activity.date).toDateString() === date.toDateString()
      );
      return hasActivities ? 'has-activities' : '';
    }
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
          .activity-calendar .has-activities {
            background-color: #f0f9ff;
          }
          .activity-calendar .react-calendar__navigation button {
            font-size: 1.2rem;
            padding: 1rem;
          }
          .activity-calendar .react-calendar__navigation button:enabled:hover,
          .activity-calendar .react-calendar__navigation button:enabled:focus {
            background-color: #f3f4f6;
          }
        `}
      </style>

      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileContent={getTileContent}
        tileClassName={getTileClassName}
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

            {modalData.length > 0 ? (
              <div className="space-y-4">
                {modalData.map((activity, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {activity.title}
                        </h4>
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded mt-1">
                          {activity.category}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {activity.duration}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2">{activity.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      <strong>Materials:</strong> {activity.materials}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No activities scheduled for this day.
                <br />
                <button
                  className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => {
                    setSelectedDate(null);
                    // Add logic to open activity creation modal
                  }}
                >
                  + Add an activity
                </button>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityCalendar;
