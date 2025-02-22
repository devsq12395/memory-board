import React, { useEffect, useState } from 'react';
import { usePopups } from '../contexts/PopupsContext';
import { getPhotoData } from '../../services/photosService';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ImageViewer: React.FC = () => {
  const popupsContext = usePopups();
  const [photoData, setPhotoData] = useState<{ image_url: string; desc: string } | null>(null);

  useEffect(() => {
    const fetchPhotoData = async () => {
      if (popupsContext.curImageID) {
        const data = await getPhotoData(popupsContext.curImageID);
        setPhotoData(data);
      }
    };
    fetchPhotoData();
  }, [popupsContext.curImageID]);

  if (!popupsContext.isImagePopupOpen || !photoData) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex justify-center items-center z-70">
      <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full">
        <button
          className="absolute top-2 left-2 text-white text-4xl bg-gray-400 bg-opacity-75 p-2 rounded-full hover:bg-opacity-75 cursor-pointer"
          onClick={() => popupsContext.setIsImagePopupOpen(false)}
        >
          <XMarkIcon className="w-6 h-6 text-gray-600" />
        </button>
        <img src={photoData.image_url} alt="Viewed" className="w-full max-h-[90vh] h-auto rounded" />
        <div className="mt-4">
          {/* Comment section placeholder */}
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;