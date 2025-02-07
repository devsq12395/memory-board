import React, { useEffect } from 'react';
import { useToolbox } from '../contexts/ToolboxContext';

const PlacePin: React.FC = () => {
  const { isPlacingPin, setIsPlacingPin } = useToolbox();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const pin = document.getElementById('pin');
      if (pin) {
        pin.style.left = `${e.pageX}px`;
        pin.style.top = `${e.pageY}px`;
      }
    };

    if (isPlacingPin) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isPlacingPin]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPlacingPin(false);
      }
    };

    if (isPlacingPin) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlacingPin]);

  const handleClick = () => {
    setIsPlacingPin(false);
  };

  return isPlacingPin ? (
    <div>
      <img id="pin" src="/path/to/pin.png" alt="Pin" style={{ position: 'absolute', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '10%', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'white', padding: '10px', border: '1px solid black' }}>
        Click to place a pin. Press ESC to cancel.
      </div>
      <div onClick={handleClick} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }} />
    </div>
  ) : null;
};

export default PlacePin;