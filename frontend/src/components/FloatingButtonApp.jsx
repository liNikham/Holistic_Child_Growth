import React, { useState } from 'react';

const FloatingButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      +
    </button>
  );
};

const FloatingButtonApp = () => {
  const [showLogModal, setShowLogModal] = useState(false);

  const handleLogActivity = () => {
    setShowLogModal(true);
  };

  return (
    <div>
      <FloatingButton onClick={handleLogActivity} />
      {showLogModal && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center"
          onClick={() => setShowLogModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-96"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing on inner click
          >
            <h2 className="text-xl font-bold mb-4">Log Activity</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Activity</label>
                <input
                  type="text"
                  placeholder="Enter activity name"
                  className="border rounded-lg w-full p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Duration (in minutes)</label>
                <input
                  type="number"
                  placeholder="Enter duration"
                  className="border rounded-lg w-full p-2"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingButtonApp;
