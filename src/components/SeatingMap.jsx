import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CanvasWrapper from './CanvasWrapper.jsx';
import './SeatingMap.css';

const SeatingMap = ({ guestToken }) => {
  const [seatName, setSeatName] = useState('');
  const [guestName, setGuestName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [elements, setElements] = useState([]);
  const [canvasTransform, setCanvasTransform] = useState({
    zoomLevel: 1,
    contentPosition: { x: 0, y: 0 },
  });
  const [guestSeatId, setGuestSeatId] = useState(null);
  const [interactionLocked, setInteractionLocked] = useState(true);

  const canvasWrapperRef = useRef(null);

  useEffect(() => {
    const fetchSeatInfo = async () => {
      try {
        const guestRes = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/guests/token/${guestToken}`
        );
        const guestName = guestRes.data.name;
        setGuestName(guestName); // 👈 This is what you need to add

        const layoutName = 'kevin-cia-lobo';

        const layoutRes = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/layouts/${layoutName}`
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

  useEffect(() => {
    if (!elements.length || !guestSeatId) return;

    const guestSeat = elements.find((el) => el.id === guestSeatId);
    if (!guestSeat) return;

    const wrapper = canvasWrapperRef.current;
    if (!wrapper) return;

    setInteractionLocked(true); // lock before moving

    requestAnimationFrame(() => {
      const { width: viewportWidth, height: viewportHeight } =
        wrapper.getBoundingClientRect();

      const seatCenterX = guestSeat.x + guestSeat.width / 2;
      const seatCenterY = guestSeat.y + guestSeat.height / 2;

      setCanvasTransform({
        zoomLevel: 1,
        contentPosition: {
          x: viewportWidth / 2 - seatCenterX,
          y: viewportHeight / 2 - seatCenterY,
        },
      });

      setTimeout(() => {
        setInteractionLocked(false); // unlock after movement
      }, 100); // delay to allow movement to finish
    });
  }, [elements, guestSeatId]);

  if (loading) {
    return <p className="seating-message">Loading seat information...</p>;
  }

  if (error) {
    return <p className="seating-message error">{error}</p>;
  }

  return (
    <div className="seating-map" ref={canvasWrapperRef}>
      <div className="seating-name-display">
        <h3 className="seating-map-title">Hi {guestName},</h3>
        <p className="seating-map-subtitle">
          Your seat number is {seatName}
        </p>
      </div>
      <CanvasWrapper
        initialTransform={canvasTransform}
        onTransformChange={setCanvasTransform}
        interactionLocked={interactionLocked}
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
                position: 'absolute',
                transform: `rotate(${el.rotation || 0}deg)`,
                transformOrigin: 'center center',
                ...extraStyle,
              }}
            >
              {el.type === 'others' ? (
                <div className="others-shape">
                  <span className="others-label">{el.name}</span>
                </div>
              ) : (
                el.name
              )}
            </div>
          );
        })}
      </CanvasWrapper>
    </div>
  );
};

export default SeatingMap;
