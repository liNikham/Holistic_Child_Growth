import React from "react";
import AppRouter from "./router";
import { useState } from "react";
import FloatingButton from "./components/FloatingButtonApp";
import ActivityCalendar from "./components/ActivityCalendar";

const activities = [
  {
    activity: 'Reading',
    category: 'Cognitive',
    duration: 30,
    notes: 'Read a chapter of a book',
    date: '2025-01-24T10:00:00.000Z',
  },
  {
    activity: 'Running',
    category: 'Physical',
    duration: 20,
    notes: 'Jogged in the park',
    date: '2025-01-23T08:00:00.000Z',
  },
];

const App = () => {
    const [showLogModal, setShowLogModal] = useState(false);
   return (
      <>
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-center text-2xl font-bold my-4">Activity Tracker</h1>
      <ActivityCalendar activities={activities} />
      <FloatingButton onClick={() => setShowLogModal(true)} />
    </div>
   <AppRouter />
   </>
)
}

export default App;