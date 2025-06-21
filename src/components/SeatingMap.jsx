import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CanvasWrapper from './CanvasWrapper.jsx';
import './SeatingMap.css';

const SeatingMap = ({ guestToken }) => {
  const [seatName, setSeatName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [elements, setElements] = useState([]);
  const [canvasTransform, setCanvasTransform] = useState({
    zoomLevel: 1,
    contentPosition: { x: 0, y: 0 },
  });
  const [guestSeatId, setGuestSeatId] = useState(null);

  useEffect(() => {
    const fetchSeatInfo = async () => {
      try {
        const guestRes = await axios.get(
          `http://localhost:5000/api/guests/token/${guestToken}`
        );
        const guestName = guestRes.data.name;

        const layoutName = 'showcase-1';

        const layoutRes = await axios.get(
          `http://localhost:5000/api/layouts/${layoutName}`
        );

        if (Array.isArray(layoutRes.data) && layoutRes.data.length > 1) {
          throw new Error(
            'There are more than 1 layouts, please delete the unused one'
          );
        }

        const guestElement = layoutRes.data.elements.find(
          (el) => el.guest === guestName
        );

        if (guestElement) {
          setSeatName(guestElement.name || 'Not assigned');
          setGuestSeatId(guestElement.id);
          focusCanvasOnSeat(guestElement);
        } else {
          setSeatName('Not assigned');
        }

        setElements(layoutRes.data.elements || []);
        setLoading(false);
      } catch (err) {
        setError(
          err.message ||
            'Failed to load seat information. Please try again later.'
        );
        setLoading(false);
      }
    };

    if (guestToken) {
      fetchSeatInfo();
    }
  }, [guestToken]);

  const focusCanvasOnSeat = (seatElement) => {
    const canvasWidth = 800;
    const canvasHeight = 600;

    const seatCenterX = seatElement.x + seatElement.width / 2;
    const seatCenterY = seatElement.y + seatElement.height / 2;

    const offsetX = canvasWidth / 2 - seatCenterX;
    const offsetY = canvasHeight / 2 - seatCenterY;

    setCanvasTransform({
      zoomLevel: 1,
      contentPosition: { x: offsetX, y: offsetY },
    });
  };

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
      <CanvasWrapper
        initialTransform={canvasTransform}
        onTransformChange={setCanvasTransform}
      >
        {elements.map((el) => {
          const isGuestSeat = el.id === guestSeatId;
          const extraStyle = isGuestSeat
            ? {
                backgroundColor: '#ffcc00',
                color: '#000',
                border: el.type === 'chair' ? '2px solid #550000' : 'none',
              }
            : {};

          return (
            <div
              key={el.id}
              className={`canvas-element ${el.type}`}
              style={{
                left: `${el.x}px`,
                top: `${el.y}px`,
                width: `${el.width}px`,
                height: `${el.height}px`,
                transform: `rotate(${el.rotation || 0}deg)`,
                transformOrigin: 'center center',
                ...extraStyle,
              }}
            >
              {el.name}
            </div>
          );
        })}
      </CanvasWrapper>
    </div>
  );
};

export default SeatingMap;
