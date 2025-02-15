import React, { useEffect, useState } from 'react';
import { getMemoryData } from '../../services/mapService';

import MemoryDetailsPopupPhotos from './MemoryDetailsPopupPhotos';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface MemoryDetailsPopupProps {
  memoryId: string;
  onClose: () => void;
}

const MemoryDetailsPopup: React.FC<MemoryDetailsPopupProps> = ({ memoryId, onClose }) => {
  const [memoryData, setMemoryData] = useState<any>(null);

  useEffect(() => {
    const fetchMemoryData = async () => {
      const data = await getMemoryData(memoryId);
      setMemoryData(data);
    };

    fetchMemoryData();
  }, [memoryId]);

  if (!memoryData) return <div>Loading...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-blue-100 p-6 rounded-md shadow-md w-3/4 h-3/4 flex relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-2 right-2 bg-gray-300 rounded-full p-1">
          <XMarkIcon className="w-8 h-8 text-gray-800 cursor-pointer" />
        </button>

        {/* Left Side - Polaroid-style Image */}
        <div className="flex-shrink-0 mr-4">
          <div className="relative border-4 border-white p-2 bg-white shadow-md">
            <img src={memoryData.thumbnail_url} alt="Memory Thumbnail" className="w-88 h-88 object-cover" />
            <img src={memoryData.bottom_img_url} alt="Sticker" className="absolute bottom-[-145px] left-1/2 transform -translate-x-1/2 w-56 h-56" />
          </div>
          <div className="mt-[160px] flex justify-around">
            <button className="bg-blue-500 text-white px-3 py-1 rounded-full cursor-pointer">Add to Favorites</button>
            <button className="bg-blue-500 text-white px-3 py-1 rounded-full cursor-pointer">Share</button>
          </div>
        </div>

        {/* Right Side - Main Content */}
        <div className="flex-grow overflow-y-auto">
          <h2 className="text-4xl font-bold text-left mb-2">{memoryData.title}</h2>
          <div>
            <div className="mt-2 mb-4 flex items-center">
              <img src="https://via.placeholder.com/40" alt="Uploader" className="rounded-full w-10 h-10" />
              <p className="text-sm ml-2">Uploaded by: Placeholder</p>
            </div>
            <p className="text-sm text-gray-500">Date: {new Date(memoryData.date).toLocaleDateString()}</p>
            <p className="text-sm mb-4 mt-6">{memoryData.desc}</p>
            <hr className="my-4" />
            
            {/* Photos */}
            <h3 className="text-lg font-bold">Photos</h3>
            <MemoryDetailsPopupPhotos memoryId={memoryId} />
            <hr className="my-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryDetailsPopup;