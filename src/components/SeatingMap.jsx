import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CanvasWrapper from './CanvasWrapper.jsx'; 
import './SeatingMap.css';

const SeatingMap = ({ guestToken }) => {
  const [seatName, setSeatName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [elements, setElements] = useState([]); // Holds layout elements

  useEffect(() => {
    const fetchSeatInfo = async () => {
      try {
        const guestRes = await axios.get(
          `http://localhost:5000/api/guests/token/${guestToken}`
        );
        const guestName = guestRes.data.name;

        const layoutName = 'showcase-1'; // Hardcoded layout name

        const layoutRes = await axios.get(
          `http://localhost:5000/api/layouts/${layoutName}`
        );

        if (Array.isArray(layoutRes.data) && layoutRes.data.length > 1) {
          throw new Error('There are more than 1 layouts, please delete the unused one');
        }

        const guestElement = layoutRes.data.elements.find(
          (el) => el.guest === guestName
        );

        if (guestElement) {
          setSeatName(guestElement.name || 'Not assigned');
        } else {
          setSeatName('Not assigned');
        }

        setElements(layoutRes.data.elements || []); // Store layout elements
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch seat information:', err);
        setError(err.message || 'Failed to load seat information. Please try again later.');
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
      <div className="seating-name-display">
        <p>Your seat number is {seatName}</p>
      </div>
      <CanvasWrapper>
        {elements.map((el) => (
          <div
            key={el.id}
            className={`canvas-element ${el.type}`}
            style={{
              position: 'absolute',
              left: `${el.x}px`,
              top: `${el.y}px`,
              width: `${el.width}px`,
              height: `${el.height}px`,
              backgroundColor: el.type === 'table' ? '#606c38' : '#fefae0',
              border: el.type === 'chair' ? '1px solid #606c38' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#606c38',
            }}
          >
            {el.name}
          </div>
        ))}
      </CanvasWrapper>
    </div>
  );
};

export default SeatingMap;