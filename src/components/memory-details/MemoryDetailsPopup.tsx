import React, { useEffect, useState } from 'react';
import { getMemoryData } from '../../services/memoryService';
import { getUserDetailsViaID } from '../../services/profile';

import MemoryDetailsPopupPhotos from './MemoryDetailsPopupPhotos';
import MemoryDetailsPopupComments from './MemoryDetailsPopupComments';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface MemoryDetailsPopupProps {
  memoryId: string;
  onClose: () => void;
}

const MemoryDetailsPopup: React.FC<MemoryDetailsPopupProps> = ({ memoryId, onClose }) => {
  const [memoryData, setMemoryData] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    const fetchMemoryData = async () => {
      const data = await getMemoryData(memoryId);
      setMemoryData(data);

      const userData = await getUserDetailsViaID(data.user_id);
      setUserDetails(userData);
    };

    fetchMemoryData();
  }, [memoryId]);

  if (!memoryData) return <div>Loading...</div>;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-blue-200/75 p-6 rounded-md shadow-md w-3/4 h-3/4 flex relative border border-gray-300">
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
            <button className="bg-blue-500 text-white px-3 py-1 rounded-full cursor-pointer">Edit Memory</button>
            <button className="bg-blue-500 text-white px-3 py-1 rounded-full cursor-pointer">Share</button>
          </div>
        </div>

        {/* Right Side - Main Content */}
        <div className="flex-grow overflow-y-auto p-4 border border-gray-300 bg-blue-100">
          <h2 className="text-4xl font-bold text-left mb-2">{memoryData.title}</h2>
          <div>
            <p className="text-sm text-gray-500">Date: {new Date(memoryData.date).toLocaleDateString()}</p>
            {userDetails && <p className="text-sm text-gray-500">Uploaded by: {userDetails.first_name} {userDetails.last_name}</p>}
            <p className="text-sm mb-4 mt-6">{memoryData.desc}</p>
            <hr className="my-4" />
            
            {/* Photos */}
            <h3 className="text-lg font-bold">Photos</h3>
            <MemoryDetailsPopupPhotos memoryId={memoryId} />
            <hr className="my-4" />

            {/* Comments */}
            <h3 className="text-lg font-bold">Comments</h3>
            <MemoryDetailsPopupComments memoryId={memoryId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryDetailsPopup;