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

  return (
    <div className="p-4">
      <Calendar
        onClickDay={handleDateChange}
        tileClassName={({ date, view }) => {
          // Add a dot to days with activities
          const hasActivities = activities.some(
            (activity) => new Date(activity.date).toDateString() === date.toDateString()
          );
          return hasActivities ? 'bg-blue-100' : '';
        }}
      />
      {selectedDate && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center"
          onClick={() => setSelectedDate(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">
              Activities on {selectedDate.toDateString()}
            </h3>
            {modalData.length > 0 ? (
              modalData.map((activity, index) => (
                <div key={index} className="mb-4">
                  <h4 className="text-lg font-semibold">{activity.activity}</h4>
                  <p>Category: {activity.category}</p>
                  <p>Duration: {activity.duration} mins</p>
                  <p>Notes: {activity.notes}</p>
                </div>
              ))
            ) : (
              <p>No activities logged on this day.</p>
            )}
            <button
              onClick={() => setSelectedDate(null)}
              className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityCalendar;
