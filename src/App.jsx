import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GuestLanding from './components/GuestLanding';
import GuestDashboard from './components/GuestDashboard';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<GuestLanding />} />
          <Route path="/guest/:guestToken" element={<GuestDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
