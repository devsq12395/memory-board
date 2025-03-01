import React, { useEffect } from 'react';
import { useToolbox } from '../contexts/ToolboxContext';
import { useUser } from '../contexts/UserContext';
import { addUserMemory } from '../../services/memoryService';

interface PlacePinProps {
  pinPosition: { lat: number; lng: number } | null;
}

const PlacePin: React.FC<PlacePinProps> = ({ pinPosition }) => {
  const toolboxContext = useToolbox();
  const userContext = useUser();

  {/* UseEffect: Move the pin image with the mouse if isPlacingPin is true */}
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const pin = document.getElementById('pin');
      if (pin) {
        const pinWidth = 50;
        const pinHeight = 50;
        pin.style.left = `${e.pageX - pinWidth / 2}px`;
        pin.style.top = `${e.pageY - pinHeight / 2}px`;
      }
    };

    if (toolboxContext.isPlacingPin) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [toolboxContext.isPlacingPin]);

  {/* UseEffect: Add listener for ESC key if isPlacingPin is true */}
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        toolboxContext.setIsPlacingPin(false);
      }
    };

    if (toolboxContext.isPlacingPin) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [toolboxContext.isPlacingPin]);

  {/* UseEffect: Place pin when pinPosition changes */}
  useEffect(() => {
    placePin();
  }, [pinPosition]);

  const placePin = async () => {
    if (!toolboxContext.isPlacingPin) return;
    toolboxContext.setIsPlacingPin(false);

    if (userContext.uid && pinPosition) {
      try {
        const newMemory = await addUserMemory(userContext.uid, pinPosition.lat, pinPosition.lng);
        toolboxContext.setAddingNewMemoryId(newMemory.id);
        toolboxContext.setIsPlacingPinPopupOpen(true);
        toolboxContext.setIsRefreshPins(true);
      } catch (error) {
        console.error('Failed to add new memory:', error);
      }
    }
  };

  return toolboxContext.isPlacingPin ? (
    <div>
      <img id="pin" src="https://res.cloudinary.com/dkloacrmg/image/upload/v1738857436/memory-board/ycqrh4wugzru3gywq2rp.png" alt="Pin" className="w-[50px] h-[50px] absolute pointer-events-none cursor-pointer" />
      <div className="absolute bottom-[30%] md:bottom-[80%] left-1/2 transform -translate-x-1/2 bg-white p-2.5 border border-black">
        <span className="hidden md:inline">Press ESC to cancel or press ESC to cancel.</span>
        <div className="mt-2 md:hidden">Click to place a pin.</div>
        <div className="mt-2 md:hidden">
          <button onClick={() => toolboxContext.setIsPlacingPin(false)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded">Cancel</button>
        </div>
      </div>
    </div>
  ) : null;
};

export default PlacePin;