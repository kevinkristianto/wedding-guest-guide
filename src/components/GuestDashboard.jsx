import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './GuestDashboard.css';
import MenuDisplay from './MenuDisplay';
import SeatingMap from './SeatingMap'; // Import the SeatingMap component
import logo from '../assets/images/wedding_logo_fefae0.svg'; // Import the logo
import axios from 'axios';

const GuestDashboard = () => {
  const { guestToken } = useParams(); // Extract guestToken from route parameters
  const [activeTab, setActiveTab] = useState('');
  const [guestData, setGuestData] = useState(null); // Holds guest-specific data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchGuestData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/guests/token/${guestToken}`
        );
        setGuestData(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch guest data:', err);
        setError('Failed to load guest data. Please try again later.');
        setLoading(false);
      }
    };

    fetchGuestData();
  }, [guestToken]);

  const renderContent = () => {
    if (loading) {
      return <p className="dashboard-message">Loading...</p>;
    }

    if (error) {
      return <p className="dashboard-message error">{error}</p>;
    }

    if (activeTab === 'Menu') {
      return (
        <MenuDisplay
          menuType={guestData?.menu === 'vegan' ? 'Vegan' : 'Standard'}
          mainCourse={guestData?.menu}
          steakCook={guestData?.steakCook}
          allergies={guestData?.allergies}
        />
      );
    } else if (activeTab === 'Seating Plan') {
      return <SeatingMap guestToken={guestToken} />;
    }

    return (
      <p className="dashboard-message">
        Please select one of the tabs above to get started.
      </p>
    );
  };

  return (
    <div className="guest-dashboard">
      <header className="dashboard-header">
        <img alt="Wedding Logo" className="app-header-logo" src={logo} />
        <div className="header-buttons">
          <button
            className={`dashboard-tab ${activeTab === 'Menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('Menu')}
          >
            Menu
          </button>
          <button
            className={`dashboard-tab ${activeTab === 'Seating Plan' ? 'active' : ''}`}
            onClick={() => setActiveTab('Seating Plan')}
          >
            Seating Plan
          </button>
        </div>
      </header>
      <div className="dashboard-content">{renderContent()}</div>
    </div>
  );
};

export default GuestDashboard;