import React, { useRef, useEffect, useState } from 'react';
import { useToolbox } from '../contexts/ToolboxContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUpIcon, ChevronDownIcon, MapPinIcon, CameraIcon } from '@heroicons/react/24/solid';
import html2canvas from 'html2canvas';
import { uploadAvatar } from '../../services/profile';

const OwnersToolbox: React.FC = () => {
  const toolboxRef = useRef<HTMLDivElement | null>(null);
  const { setIsPlacingPin } = useToolbox();
  const [isExpanded, setIsExpanded] = useState(true);

  // Handles dragging the toolbox
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

  const handleCaptureAndShare = async () => {
    const mapElement = document.querySelector('.w-screen.m-0.p-0'); // Assuming this is the map container
    if (!mapElement) {
      console.error('Map element not found');
      return;
    }

    try {
      const canvas = await html2canvas(mapElement);
      canvas.toBlob(async (blob: Blob | null) => {
        if (blob) {
          const imageUrl = await uploadAvatar(new File([blob], 'map.png', { type: 'image/png' }));
          console.log('Uploaded image URL:', imageUrl);
        }
      });
    } catch (error) {
      console.error('Error capturing or uploading image:', error);
    }
  };

  useEffect(() => {
    const element = toolboxRef.current;
    if (element) {
      element.style.left = '10px';
      element.style.top = '10px';
    }
  }, []);

  return (
    <div
      ref={toolboxRef}
      onMouseDown={handleDragStart}
      className="absolute left-2 top-2 bg-white shadow-lg rounded-lg p-3 w-56 cursor-move z-10 border border-gray-300"
    >
      {/* Header with Collapse Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Owner's Toolbox</h3>
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-600 hover:text-gray-800">
          {isExpanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </button>
      </div>

      {/* Collapsible Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 space-y-2"
          >
            {/* Place Pin Button */}
            <button
              onClick={handlePlacePinClick}
              className="flex items-center justify-center w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition cursor-pointer"
            >
              <MapPinIcon className="w-5 h-5 mr-2" /> Place Pin
            </button>

            {/* Camera Button */}
            <button
              onClick={handleCaptureAndShare}
              className="flex items-center justify-center w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition cursor-pointer"
            >
              <CameraIcon className="w-5 h-5 mr-2" /> Take Photo & Share
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OwnersToolbox;
