import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SeatingMap.css';

const SeatingMap = ({ guestToken }) => {
  const [seatName, setSeatName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeatInfo = async () => {
      try {
        const guestRes = await axios.get(`http://localhost:5000/api/guests/token/${guestToken}`);
        const guestName = guestRes.data.name;

        const layoutName = 'showcase-1';

        const layoutRes = await axios.get(`http://localhost:5000/api/layouts/${layoutName}`);

        const guestElement = layoutRes.data.elements.find((el) => el.guest === guestName);

        if (guestElement) {
          setSeatName(guestElement.name || 'Not assigned');
        } else {
          setSeatName('Not assigned');
        }

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch seat information:', err);
        setError('Failed to load seat information. Please try again later.');
        setLoading(false);
      }
    };

    if (guestToken) {
      fetchSeatInfo();
    }
  }, [guestToken]);

  if (loading) {
    return <p className="seating-message">Loading seat information...</p>;
  }

  if (error) {
    return <p className="seating-message error">{error}</p>;
  }

  return (
    <div className="seating-map">
      <h2>Your seat number is:</h2>
      <p>{seatName}</p>
    </div>
  );
};

export default SeatingMap;