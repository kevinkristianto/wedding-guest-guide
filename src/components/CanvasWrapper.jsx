import React, { useState, useRef, useEffect } from 'react';
import './CanvasWrapper.css';

const CanvasWrapper = ({
  children,
  onTransformChange,
  initialTransform,
  interactionLocked,
}) => {
  const [zoomLevel, setZoomLevel] = useState(initialTransform?.zoomLevel || 1);
  const [contentPosition, setContentPosition] = useState(
    initialTransform?.contentPosition || { x: 0, y: 0 }
  );
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [isTouching, setIsTouching] = useState(false);
  const [lastTouch, setLastTouch] = useState(null);
  const [lastPinchDistance, setLastPinchDistance] = useState(null);
  const [mouseMoved, setMouseMoved] = useState(false);
  const [touchMoved, setTouchMoved] = useState(false);

  const contentRef = useRef(null);

  useEffect(() => {
    if (onTransformChange) {
      onTransformChange({ zoomLevel, contentPosition });
    }
  }, [zoomLevel, contentPosition, onTransformChange]);

  useEffect(() => {
    if (initialTransform) {
      setZoomLevel(initialTransform.zoomLevel || 1);
      setContentPosition(initialTransform.contentPosition || { x: 0, y: 0 });
    }
  }, [initialTransform]);

  const handleMouseDown = (e) => {
    if (interactionLocked) return;
    setIsPanning(true);
    setStartPan({
      x: e.clientX - contentPosition.x,
      y: e.clientY - contentPosition.y,
    });
    setMouseMoved(false);
  };

  const handleMouseMove = (e) => {
    if (interactionLocked || !isPanning) return;
    setMouseMoved(true);
    const newX = e.clientX - startPan.x;
    const newY = e.clientY - startPan.y;
    setContentPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    if (interactionLocked) return;
    setIsPanning(false);
    setMouseMoved(false);
  };

  const handleWheel = (e) => {
    if (interactionLocked) return;
    e.preventDefault();
    e.stopPropagation();

    const ZOOM_SENSITIVITY = 0.0015;
    const wrapperRect = e.currentTarget.getBoundingClientRect();

    const mouseX = e.clientX - wrapperRect.left;
    const mouseY = e.clientY - wrapperRect.top;

    const prevZoom = zoomLevel;
    const zoomFactor = 1 - e.deltaY * ZOOM_SENSITIVITY;
    const newZoom = Math.min(Math.max(prevZoom * zoomFactor, 0.5), 2);

    const scaleChange = newZoom / prevZoom;

    setContentPosition((prev) => ({
      x: mouseX - (mouseX - prev.x) * scaleChange,
      y: mouseY - (mouseY - prev.y) * scaleChange,
    }));

    setZoomLevel(newZoom);
  };

  const getTouchDistance = (touches) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e) => {
    if (interactionLocked) return;

    if (e.touches.length === 1) {
      setIsTouching(true);
      setLastTouch({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setLastPinchDistance(null);
      setTouchMoved(false);
    } else if (e.touches.length === 2) {
      setIsTouching(false);
      setLastTouch(null);
      setLastPinchDistance(getTouchDistance(e.touches));
      setTouchMoved(false);
    }
  };

  const handleTouchMove = (e) => {
    if (interactionLocked) return;

    if (e.touches.length === 2 && lastPinchDistance !== null) {
      const newDistance = getTouchDistance(e.touches);
      const delta = newDistance - lastPinchDistance;
      if (Math.abs(delta) > 2) {
        setZoomLevel((prev) => {
          const ZOOM_SENSITIVITY = 0.005;
          const zoomFactor = 1 + delta * ZOOM_SENSITIVITY;
          const newZoom = prev * zoomFactor;
          return Math.min(Math.max(newZoom, 0.5), 2);
        });

        setLastPinchDistance(newDistance);
      }
      setTouchMoved(true);
      e.preventDefault();
    } else if (isTouching && e.touches.length === 1 && lastTouch) {
      const deltaX = e.touches[0].clientX - lastTouch.x;
      const deltaY = e.touches[0].clientY - lastTouch.y;
      setContentPosition((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
      setLastTouch({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setTouchMoved(true);
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e) => {
    if (interactionLocked) return;

    if (e.touches.length === 0) {
      setIsTouching(false);
      setLastTouch(null);
      setLastPinchDistance(null);
      setTouchMoved(false);
    } else if (e.touches.length === 1) {
      setIsTouching(true);
      setLastTouch({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setLastPinchDistance(null);
      setTouchMoved(false);
    }
  };

  return (
    <div
      className="canvas-wrapper"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }}
    >
      <div
        className="canvas-content"
        ref={contentRef}
        style={{
          transform: `translate(${contentPosition.x}px, ${contentPosition.y}px) scale(${zoomLevel})`,
          transformOrigin: 'top left',
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default CanvasWrapper;
