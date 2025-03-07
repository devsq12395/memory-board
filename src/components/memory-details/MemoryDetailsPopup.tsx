import React, { useEffect, useState } from 'react';
import { getMemoryData } from '../../services/memoryService';

import MemoryDetailsPopupPhotos from './MemoryDetailsPopupPhotos';
import MemoryDetailsPopupComments from './MemoryDetailsPopupComments';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../common/Button';

import { useSystem } from '../contexts/SystemContext';
import { useUser } from '../contexts/UserContext';
import { usePopups } from '../contexts/PopupsContext';
import { useToolbox } from '../contexts/ToolboxContext';
import { getUserDetailsViaID, UserDetails } from '../../services/profile';

import LoadingCircle from '../common/LoadingCircle';

interface MemoryDetailsPopupProps {
  memoryId: string;
  onClose: () => void;
  pageUserID: string;
}

const MemoryDetailsPopup: React.FC<MemoryDetailsPopupProps> = ({ memoryId, onClose, pageUserID }) => {
  const systemContext = useSystem();
  const userContext = useUser();
  const popupsContext = usePopups();
  const toolboxContext = useToolbox();

  const [memoryData, setMemoryData] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [thumbnailStyle, setThumbnailStyle] = useState<{ width: string; height: string }>({ width: '100%', height: 'auto' });

  const handleThumbnailLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    const parentWidth = img.parentElement?.clientWidth || 300;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    let newHeight: number;
    
    if (naturalWidth > naturalHeight) {
      // Landscape: 4:3 ratio: height = parentWidth * (3/4)
      newHeight = parentWidth * (3 / 4);
    } else if (naturalWidth < naturalHeight) {
      // Portrait: 3:4 ratio: height = parentWidth * (4/3)
      newHeight = parentWidth * (4 / 3);
    } else {
      // Square: height equals parent's width
      newHeight = parentWidth;
    }
    setThumbnailStyle({ width: '100%', height: `${newHeight}px` });
  };

  // Fetch memory data
  useEffect(() => {
    fetchMemoryData();
  }, [memoryId, popupsContext.refreshMemoryDetailsPopup]);

  const fetchMemoryData = async () => {
    const data = await getMemoryData(memoryId);
    setMemoryData(data);

    const userData = await getUserDetailsViaID(data.user_id);
    setUserDetails(userData);

    // When memory is fully loaded, push new URL with memory ID
    if (userData?.user_name) {
      window.history.pushState({}, '', `/${userData.user_name}/${memoryId}`);
    }
  };

  const onButtonClick = (buttonType: string) => {
    switch (buttonType) {
      case 'edit':
        popupsContext.setEditMemoryPopupMode('edit');
        toolboxContext.setAddingNewMemoryId(memoryId);
        break;
      case 'delete':
        popupsContext.setIsDeleteMemoryPopupOpen(true);
        popupsContext.setCurMemoryId(memoryId);
        break;
      default:
        break;
    }
  };

  return <>
    { systemContext.mode === 'desktop' ? 
      <>
        {/* Desktop View */}
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30">
          <div className="bg-blue-200/75 p-6 rounded-md shadow-md w-3/4 h-3/4 flex relative border border-gray-300">
            {/* Close Button */}
            <button onClick={onClose} className="absolute top-2 right-2 bg-gray-300 rounded-full p-1">
              <XMarkIcon className="w-8 h-8 text-gray-800 cursor-pointer" />
            </button>

            {!memoryData && !userDetails ? <div className="flex w-full h-full items-center justify-center">
              <LoadingCircle />
            </div> : <>
              {/* Left Side - Polaroid-style Image */}
              <div className="flex-shrink-0 mr-4">
                <div className="relative border-4 border-white p-2 bg-white shadow-md">
                  <img 
                    src={memoryData.thumbnail_url} 
                    alt="Memory Thumbnail" 
                    onLoad={handleThumbnailLoad} 
                    style={thumbnailStyle} 
                    className="object-cover max-w-120 max-h-120" 
                  />
                </div>
                <div className="mt-[20px] flex justify-center gap-4 w-full">
                  <Button type="button" text="Edit Memory" styleType="primary" onClick={() => onButtonClick('edit')} />
                  <Button type="button" text="Delete Memory" className="bg-red-400" styleType="primary" onClick={() => onButtonClick('delete')} />
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
                  <MemoryDetailsPopupPhotos 
                    memoryId={memoryId} 
                    pageUserDetails={userDetails}
                  />
                  <hr className="my-4" />

                  {/* Comments */}
                  <h3 className="text-lg font-bold">Comments</h3>
                  <MemoryDetailsPopupComments memoryId={memoryId} />
                </div>
              </div>
            </>}
          </div>
        </div>
      </> : 
      <>
        {/* Mobile View */}
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-blue-200/85 w-full h-full flex flex-col items-center relative border border-gray-300 overflow-y-auto overflow-x-hidden">
            {/* Close Button */}
            <button onClick={onClose} className="absolute top-2 right-2 bg-gray-300 rounded-full p-1">
              <XMarkIcon className="w-8 h-8 text-gray-800 cursor-pointer" />
            </button>

            {!memoryData && !userDetails ? <div className="flex w-full h-full items-center justify-center">
              <LoadingCircle />
            </div> : <>
              {/* Polaroid-style Image */}
              <div className="mt-20 w-[90%] max-w-[90%] border-4 border-white p-2 bg-white shadow-md">
                <img 
                  src={memoryData.thumbnail_url} 
                  alt="Memory Thumbnail" 
                  onLoad={handleThumbnailLoad} 
                  style={thumbnailStyle} 
                  className="object-cover" 
                />
              </div>

              {/* Main Content */}
              <div className="mt-6 flex flex-col p-4 border border-gray-300 bg-blue-100">
                <h2 className="text-4xl font-bold text-left mb-2">{memoryData.title}</h2>
                <div>
                  <p className="text-sm text-gray-500">Date: {new Date(memoryData.date).toLocaleDateString()}</p>
                  {userDetails && <p className="text-sm text-gray-500">Uploaded by: {userDetails.first_name} {userDetails.last_name}</p>}
                  <p className="text-sm mb-4 mt-6">{memoryData.desc}</p>
                  <hr className="my-4" />
                  
                  {/* Photos */}
                  <h3 className="text-lg font-bold">Photos</h3>
                  <MemoryDetailsPopupPhotos 
                    memoryId={memoryId} 
                    pageUserDetails={userDetails}
                  />
                  <hr className="my-4" />

                  {/* Comments */}
                  <h3 className="text-lg font-bold">Comments</h3>
                  <MemoryDetailsPopupComments memoryId={memoryId} />
                </div>
              </div>
            </>}

          </div>
        </div>
      </>
    }
  </>;
};

export default MemoryDetailsPopup;