import React, { useRef, useEffect } from 'react';
import { useToolbox } from '../contexts/ToolboxContext';

const OwnersToolbox: React.FC = () => {
  const toolboxRef = useRef<HTMLDivElement | null>(null);
  const { setIsPlacingPin } = useToolbox();

  const handleDragStart = (e: React.MouseEvent) => {
    const element = toolboxRef.current;
    if (element) {
      const shiftX = e.clientX - element.getBoundingClientRect().left;
      const shiftY = e.clientY - element.getBoundingClientRect().top;

      const moveAt = (pageX: number, pageY: number) => {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
      };

      const onMouseMove = (event: MouseEvent) => {
        moveAt(event.pageX, event.pageY);
      };

      document.addEventListener('mousemove', onMouseMove);

      element.onmouseup = () => {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
      };
    }
  };

  const handlePlacePinClick = () => {
    setIsPlacingPin(true);
  };

  useEffect(() => {
    const element = toolboxRef.current;
    if (element) {
      const centerX = window.innerWidth / 2 - element.offsetWidth / 2;
      element.style.left = `${centerX}px`;
      element.style.top = '10px';
    }
  }, []);

  return (
    <div
      ref={toolboxRef}
      onMouseDown={handleDragStart}
      className="absolute border border-gray-300 p-2 w-48 bg-gray-100 cursor-move z-10"
    >
      <h3 className="text-lg font-semibold">Owner's Toolbox</h3>
      <button className="mt-2 bg-blue-500 text-white py-1 px-3 rounded cursor-pointer hover:bg-blue-600" onClick={handlePlacePinClick}>Place a New Pin</button>
    </div>
  );
};

export default OwnersToolbox;