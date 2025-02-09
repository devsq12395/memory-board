import React, { useEffect } from 'react';
import { useToolbox } from '../contexts/ToolboxContext';
import { useUser } from '../contexts/UserContext';
import { addUserMemory } from '../../services/mapService';

interface PlacePinProps {
  pinPosition: { lat: number; lng: number } | null;
}

const PlacePin: React.FC<PlacePinProps> = ({ pinPosition }) => {
  const { isPlacingPin, setIsPlacingPin, setIsRefreshPins, setAddingNewMemoryId } = useToolbox();
  const userContext = useUser();

  {/* UseEffect: Move the pin image with the mouse if isPlacingPin is true */}
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

  {/* UseEffect: Add listener for ESC key if isPlacingPin is true */}
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
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

  {/* UseEffect: Place pin when pinPosition changes */}
  useEffect(() => {
    placePin();
  }, [pinPosition]);

  const placePin = async () => {
    if (!isPlacingPin) return;
    setIsPlacingPin(false);

    if (userContext.uid && pinPosition) {
      try {
        const newMemory = await addUserMemory(userContext.uid, pinPosition.lat, pinPosition.lng);
        setAddingNewMemoryId(newMemory.id);
        setIsRefreshPins(true);
      } catch (error) {
        console.error('Failed to add new memory:', error);
      }
    }
  };

  return isPlacingPin ? (
    <div>
      <img id="pin" src="/path/to/pin.png" alt="Pin" style={{ position: 'absolute', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '80%', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'white', padding: '10px', border: '1px solid black' }}>
        Click to place a pin. Press ESC to cancel.
      </div>
    </div>
  ) : null;
};

export default PlacePin;