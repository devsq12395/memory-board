import React, { useRef, useEffect, useState } from 'react';
import { useToolbox } from '../contexts/ToolboxContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUpIcon, ChevronDownIcon, MapPinIcon, CameraIcon } from '@heroicons/react/24/solid';
import html2canvas from 'html2canvas';
import { uploadToCloudinary } from '../../services/cloudinaryService';

const OwnersToolbox: React.FC = () => {
  const toolboxRef = useRef<HTMLDivElement | null>(null);
  const toolboxContext = useToolbox();
  const [isExpanded, setIsExpanded] = useState(true);
  const [tooltip, setTooltip] = useState({ visible: false, content: '', position: { x: 0, y: 0 } });

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
    toolboxContext.setIsPlacingPin(true);
  };

  const handleCaptureAndShare = async () => {
    const mapElement = document.querySelector('.w-screen.m-0.p-0') as HTMLElement; 
    
    if (!mapElement) {
      console.error('Map element not found');
      return;
    }

    toolboxContext.setSharePhotoUrl(null);
    toolboxContext.setSharePhotoPopupIsOpen(true);

    try {
      try {
        const canvas = await html2canvas(mapElement, {
          useCORS: true,
          allowTaint: false
        });
        canvas.toBlob(async (blob: Blob | null) => {
          if (blob) {
            // Upload the image directly to Cloudinary
            const randomFilename = Math.random().toString(36).substring(2, 15) + '.png';
            const imageUrl = await uploadToCloudinary(new File([blob], randomFilename, { type: 'image/png' }));

            toolboxContext.setSharePhotoUrl(imageUrl || null);
          }
        });
      } catch (error) {
        console.error('Error capturing the map:', error);
      }
    } catch (error) {
      console.error('Error capturing or uploading image:', error);
    }
  };

  const showTooltip = (content: string, x: number, y: number) => {
    setTooltip({ visible: true, content, position: { x, y } });
  };

  const hideTooltip = () => {
    setTooltip({ ...tooltip, visible: false });
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
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-600 hover:text-gray-800 cursor-pointer">
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
            <div
              onMouseEnter={(e) => showTooltip('Place a memory pin on the map', e.clientX, e.clientY)}
              onMouseLeave={hideTooltip}
              onMouseMove={(e) => showTooltip('Place a memory pin on the map', e.clientX, e.clientY)}
              style={{ position: 'relative', display: 'inline-block', width: '100%' }}
            >
              <button
                onClick={handlePlacePinClick}
                className="flex items-center justify-center w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition cursor-pointer"
              >
                <MapPinIcon className="w-5 h-5 mr-2" /> Place Pin
              </button>
            </div>

            {/* Camera Button */}
            <div
              onMouseEnter={(e) => showTooltip('Take a screenshot of where the map is and you can share this photo on social media.', e.clientX, e.clientY)}
              onMouseLeave={hideTooltip}
              onMouseMove={(e) => showTooltip('Take a screenshot of where the map is and you can share this photo on social media.', e.clientX, e.clientY)}
              style={{ position: 'relative', display: 'inline-block', width: '100%' }}
            >
              <button
                onClick={handleCaptureAndShare}
                className="flex items-center justify-center w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition cursor-pointer"
              >
                <CameraIcon className="w-5 h-5 mr-2" /> Take Photo & Share
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {tooltip.visible && (
        <div
          style={{
            position: 'fixed',
            top: tooltip.position.y + 10,
            left: tooltip.position.x + 10,
            backgroundColor: 'black',
            color: 'white',
            padding: '5px',
            borderRadius: '3px',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default OwnersToolbox;
