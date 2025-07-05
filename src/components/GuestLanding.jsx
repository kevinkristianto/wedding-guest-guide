import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './GuestLanding.css';
import logo from '../assets/images/wedding_logo_fefae0.svg';

const GuestLanding = () => {
  const [guestName, setGuestName] = useState('');
  const [guestSuggestions, setGuestSuggestions] = useState([]);
  const [allGuests, setAllGuests] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/guests`
        );
        setAllGuests(res.data);
      } catch (err) {
        console.error('Failed to fetch guests:', err);
      }
    };

    fetchGuests();
  }, []);

  const handleGuestInput = (e) => {
    const value = e.target.value;
    setGuestName(value);

    if (value.trim().length < 3) {
      setGuestSuggestions([]);
      return;
    }

    const suggestions = allGuests
      .filter((g) => g.name.toLowerCase().includes(value.trim().toLowerCase()))
      .map((g) => g.name);

    setGuestSuggestions(suggestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!guestName.trim()) {
      setError('Please enter your name.');
      return;
    }

    const guest = allGuests.find(
      (g) => g.name.toLowerCase() === guestName.trim().toLowerCase()
    );

    if (!guest) {
      setError('Guest not found. Please check your name or contact admin.');
      return;
    }

    navigate(`/guest/${encodeURIComponent(guest.guestToken)}`);
  };

  const handleSuggestionClick = (suggestion) => {
    setGuestName(suggestion);
    setGuestSuggestions([]);
  };

  return (
    <div className="guest-landing">
      <img alt="Wedding Logo" className="app-body-logo" src={logo} />
      <div className="guest-header">
        <h1>Welcome to Kevin & Leticia's Wedding</h1>
        <p>We're so glad you're here!</p>
      </div>
      <div className="guest-container">
        <form onSubmit={handleSubmit} className="guest-form">
          <label className="guest-label">
            Please enter your name here:
            <div className="input-wrapper">
              <input
                type="text"
                value={guestName}
                onChange={handleGuestInput}
                className="guest-input"
                placeholder="Your Name"
              />
              {guestSuggestions.length > 0 && (
                <ul className="suggestions">
                  {guestSuggestions.map((name, idx) => (
                    <li key={idx} onClick={() => handleSuggestionClick(name)}>
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </label>
          <button type="submit" className="guest-button">
            Submit
          </button>
        </form>
        {error && <p className="guest-error">{error}</p>}
      </div>
    </div>
  );
};

export default GuestLanding;
