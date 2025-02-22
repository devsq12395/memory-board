import React, { useEffect, useState } from 'react';
import { getPhotosOfMemory, addPhoto } from '../../services/photosService';
import Button from '../common/Button';

import { usePopups } from '../contexts/PopupsContext';

interface MemoryDetailsPopupPhotosProps {
  memoryId: string;
}

const MemoryDetailsPopupPhotos: React.FC<MemoryDetailsPopupPhotosProps> = ({ memoryId }) => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const photosPerPage = 5;

  const popupsContext = usePopups();

  useEffect(() => {
    const fetchPhotos = async () => {
      const photosData = await getPhotosOfMemory(memoryId);
      setPhotos(photosData);
    };
    fetchPhotos();
  }, [memoryId]);

  const totalPages = Math.ceil(photos.length / photosPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 0 ? prevPage - 1 : totalPages - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage < totalPages - 1 ? prevPage + 1 : 0));
  };

  const currentPhotos = photos.slice(
    currentPage * photosPerPage,
    (currentPage + 1) * photosPerPage
  );

  const handleImageClick = (photoId: string) => {
    popupsContext.setIsImagePopupOpen(true);
    popupsContext.setCurImageID(photoId);
  };

  const handleUpload = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    fileInput.onchange = async (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files) {
        setUploadStatus('Uploading...');
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

            const response = await fetch(import.meta.env.VITE_CLOUDINARY_API_URL, {
              method: 'POST',
              body: formData
            });

            if (!response.ok) {
              throw new Error('Failed to upload image to Cloudinary');
            }

            const data = await response.json();
            await addPhoto(memoryId, data.secure_url);
          } catch (error) {
            console.error('Error uploading photo:', error);
            alert(`Failed to upload photo ${file.name}.`);
          }
        }
        setUploadStatus('Upload successful!');
        setTimeout(() => setUploadStatus(null), 4000);
        const photosData = await getPhotosOfMemory(memoryId);
        setPhotos(photosData);
      }
    };
    fileInput.click();
  };

  return (
    <div className="flex flex-col items-center justify-center space-x-4">
      {/* Pagination of Photos */}
      <div className="flex items-center justify-between w-full">
        <button className="bg-gray-300 rounded-full p-3 text-2xl flex items-center justify-center cursor-pointer" onClick={handlePrevPage}>{'<'}</button>
        <div className="flex items-start space-x-2 overflow-x-auto flex-grow justify-center flex-wrap gap-3">
          {currentPhotos.map((photo, index) => (
            photo.image_url ? (
              <img
                key={index}
                src={photo.image_url}
                alt="Memory Photo"
                className="w-32 h-32 object-cover rounded-md cursor-pointer"
                onClick={() => handleImageClick(photo.id)}
              />
            ) : null
          ))}
        </div>
        <button className="bg-gray-300 rounded-full p-3 text-2xl flex items-center justify-center cursor-pointer" onClick={handleNextPage}>{'>'}</button>
      </div>
      {/* Page Indicator */}
      <div className="flex space-x-1 mt-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <span
            key={index}
            className={`h-3 w-3 rounded-full ${index === currentPage ? 'bg-blue-500' : 'bg-gray-300'}`}
          />
        ))}
      </div>

      {/* Upload System */}
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded-full cursor-pointer mt-4"
        onClick={handleUpload}
      >
        Upload Photos
      </button>
      {uploadStatus && (
        <p className={`mt-2 text-${uploadStatus === 'Uploading...' ? 'blue' : 'green'}-500`}>{uploadStatus}</p>
      )}
    </div>
  );
};

export default MemoryDetailsPopupPhotos;