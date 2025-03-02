import React, { useState } from 'react';
import { updateMemoryDetails, deleteMemory } from '../../services/memoryService';
import { useToolbox } from '../contexts/ToolboxContext';
import Button from '../common/Button';
import Popup from '../common/Popup';

interface PlacePinDetailsPopupProps {
  stickerData: { name: string; imageUrl: string };
  setIsChooseStickerPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTriggerDelayedRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultThumbnailImg = 'https://res.cloudinary.com/dkloacrmg/image/upload/v1739507939/memory-board/pbmgfsmpejt3wulrdruy.png';

const PlacePinDetailsPopup: React.FC<PlacePinDetailsPopupProps> = ({ stickerData, setIsChooseStickerPopupOpen, setIsTriggerDelayedRefresh }) => {
  const toolboxContext = useToolbox();

  const [thumbnailImg, setThumbnailImg] = useState<string>(defaultThumbnailImg);
  const [formData, setFormData] = useState({
    title: '',
    date: new Date('2025-01-01').toISOString().split('T')[0],
    description: '',
    sticker: '',
    stickerName: ''
  });
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [thumbnailStyle, setThumbnailStyle] = useState<{ width: string; height: string; maxHeight: string }>({ width: '200px', height: '200px', maxHeight: '500px' });

  const handleSubmit = async () => {
    try {
      const { title, date, description } = formData;
      console.log (formData);
      console.log (toolboxContext.addingNewMemoryId);

      await updateMemoryDetails(
        toolboxContext.addingNewMemoryId || '',
        title,
        date,
        description,
        thumbnailImg,
        stickerData.imageUrl
      );

      setFormData({
        title: '',
        date: new Date('2025-01-01').toISOString().split('T')[0],
        description: '',
        sticker: '',
        stickerName: ''
      });
      setThumbnailImg(defaultThumbnailImg);

      toolboxContext.setAddingNewMemoryId(null);
      toolboxContext.setIsPlacingPinPopupOpen(false);
      setIsTriggerDelayedRefresh(true);
    } catch (error) {
      console.error('Error updating memory:', error);
    }
  };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(import.meta.env.VITE_CLOUDINARY_API_URL, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (files && files[0]) {
      console.log('uploading image');
      setUploading(true);
      setUploadMessage('Uploading Image...');
      try {
        const uploadedUrl = await uploadImageToCloudinary(files[0]);
        setThumbnailImg(uploadedUrl);
        setUploadMessage('Image Uploaded!');
      } catch (error) {
        console.error('Error uploading image:', error);
        setUploadMessage('Failed to upload image.');
      } finally {
        setUploading(false);
      }
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleCancel = async () => {
    if (toolboxContext.addingNewMemoryId) {
      await deleteMemory(toolboxContext.addingNewMemoryId);
    }
    toolboxContext.setAddingNewMemoryId(null);
    toolboxContext.setIsPlacingPinPopupOpen(false);
    
    setIsTriggerDelayedRefresh(true);
    console.log('Cancel button clicked');
  };

  const handleThumbnailLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    const parentWidth = img.parentElement?.clientWidth || 200; // get parent's width
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

    // Set width to 100% to fill parent, and height dynamically
    setThumbnailStyle({ width: '100%', height: `${newHeight}px`, maxHeight: `500px` });
  };

  if (!toolboxContext.isPlacingPinPopupOpen) return null;

  return <>
    { !toolboxContext.addingNewMemoryId ? <Popup
      isShow={true}
      onClose={() => toolboxContext.setIsPlacingPinPopupOpen(false)}
      titleText="Let's add details to this memory"
    >
      <div className="flex flex-col items-center justify-center h-full">
        <div className="loader border-t-4 border-b-4 border-gray-300 rounded-full w-8 h-8 mb-4 animate-spin"></div>
        <p>Preparing this memory pin...</p>
      </div>
    </Popup> : <Popup
      isShow={true}
      onClose={() => toolboxContext.setIsPlacingPinPopupOpen(false)}
      titleText="Let's add details to this memory"
    >
      <div className="flex flex-col gap-4">
        {/* Text Form fields */}
        <div className="form-group">
          <label htmlFor="title" className="text-sm font-medium text-gray-700">Title</label>
          <input type="text" id="title" name="title" placeholder="Enter title" value={formData.title} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div className="form-group">
          <label htmlFor="date" className="text-sm font-medium text-gray-700">Date</label>
          <input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div className="form-group">
          <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" name="description" rows={3} placeholder="Enter description" value={formData.description} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none"></textarea>
        </div>
      </div>
      <div className="h-full">
        {/* Thumbnail Image Form Group */}
        <div className="flex flex-col justify-between h-full">
          {/* Thumbnail Image */}
          <div className="form-group">
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">Thumbnail Image</label>
            <Button type="button" text="Choose File" styleType="file" onClick={() => document.getElementById('thumbnail')?.click()} />
            <input type="file" id="thumbnail" name="thumbnail" accept="image/*" onChange={handleInputChange} className="hidden" />
            <img 
              src={thumbnailImg || 'https://res.cloudinary.com/dkloacrmg/image/upload/v1717925908/cld-sample-3.jpg'} 
              alt="Thumbnail Preview" 
              onLoad={handleThumbnailLoad}
              style={thumbnailStyle}
              className="mt-2 object-cover mx-auto border border-gray-300 rounded-md" 
            />
            <p className="text-center text-sm text-gray-500 mt-2">{uploadMessage}</p>
          </div>

          {/* Submit and Cancel buttons */}
          <div className="flex justify-end space-x-2 col-span-2 mt-2">
            <Button type="button" text="Submit" styleType="primary" disabled={uploading} 
              onClick={handleSubmit}
            />
            <Button type="button" text="Cancel" styleType="secondary" disabled={uploading} 
              onClick={handleCancel} 
            />
          </div>
        </div>
      </div>
    </Popup>}
  </>;
};

export default PlacePinDetailsPopup;