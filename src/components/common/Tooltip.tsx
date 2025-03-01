import React, { useState } from 'react';

interface TooltipProps {
  content: string;
}

const Tooltip: React.FC<TooltipProps> = ({ content }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
    setVisible(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setVisible(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{ display: 'inline-block', position: 'relative' }}
    >
      {visible && (
        <div
          style={{ top: position.y + 10, left: position.x + 10 }}
          className="fixed bg-black text-white p-1 rounded pointer-events-none z-50"
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;