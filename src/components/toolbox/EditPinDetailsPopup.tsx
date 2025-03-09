import React, { useEffect, useState } from 'react';
import { updateMemoryDetails, deleteMemory, getMemoryData } from '../../services/memoryService';

import { useToolbox } from '../contexts/ToolboxContext';
import { usePopups } from '../contexts/PopupsContext';

import Button from '../common/Button';
import Popup from '../common/Popup';
import { DEFAULT_MEMORY_THUMBNAIL } from '../../constants/constants';

export type PopupMode = 'place' | 'edit' | 'hidden';

interface EditPinDetailsPopupProps {
  mode: PopupMode;
  stickerData: { name: string; imageUrl: string };
  setIsChooseStickerPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTriggerDelayedRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditPinDetailsPopup: React.FC<EditPinDetailsPopupProps> = ({ mode, stickerData, setIsChooseStickerPopupOpen, setIsTriggerDelayedRefresh }) => {
  const toolboxContext = useToolbox();
  const popupsContext = usePopups();

  const [thumbnailImg, setThumbnailImg] = useState<string>(DEFAULT_MEMORY_THUMBNAIL);
  const [formData, setFormData] = useState({
    title: '',
    date: new Date('2025-01-01').toISOString().split('T')[0],
    description: '',
    sticker: '',
    stickerName: ''
  });
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    if (toolboxContext.addingNewMemoryId) {
      setMemoryData(toolboxContext.addingNewMemoryId);
    }
  }, [toolboxContext.addingNewMemoryId]);

  const setMemoryData = async (memoryId: string) => {
    try {
      const memoryData = await getMemoryData(memoryId);
      if (!memoryData) {
        throw new Error('Memory not found');
      }

      setFormData({
        title: memoryData.title,
        date: memoryData.date,
        description: memoryData.desc,
        sticker: '',
        stickerName: ''
      });
      setThumbnailImg(memoryData.thumbnail_url || DEFAULT_MEMORY_THUMBNAIL);
    } catch (error) {
      console.error('Error fetching memory data:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const { title, date, description } = formData;

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
      setThumbnailImg(DEFAULT_MEMORY_THUMBNAIL);

      toolboxContext.setAddingNewMemoryId(null);
      popupsContext.setEditMemoryPopupMode('hidden');
      setIsTriggerDelayedRefresh(true);

      if (mode === 'edit') {
        popupsContext.setRefreshMemoryDetailsPopup(true);
      }
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
    popupsContext.setEditMemoryPopupMode('hidden');
    
    setIsTriggerDelayedRefresh(true);
  };

  if (mode === 'hidden') return null;

  return <>
    { !toolboxContext.addingNewMemoryId ? <Popup
      isShow={true}
      onClose={() => popupsContext.setEditMemoryPopupMode('hidden')}
      titleText="Loading Memory Details"
    >
      <div className="flex flex-col items-center justify-center h-full">
        <div className="loader border-t-4 border-b-4 border-gray-300 rounded-full w-8 h-8 mb-4 animate-spin"></div>
        <p>Preparing this memory pin...</p>
      </div>
    </Popup> : <Popup
      isShow={true}
      onClose={() => popupsContext.setEditMemoryPopupMode('hidden')}
      titleText={mode === 'place' ? "Let's add details to this memory" : "Edit memory details"}
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
            <input type="file" id="thumbnail" name="thumbnail" accept="image/*" onChange={handleInputChange} className="hidden" />
            <img 
              src={thumbnailImg || DEFAULT_MEMORY_THUMBNAIL} 
              alt="Thumbnail Preview" 
              className="mt-2 border border-gray-300 rounded-md max-w-[200px] max-h-auto object-cover mx-auto" 
            />
            <div className="flex justify-center w-full mt-2">
              <Button type="button" text="Choose File" styleType="file" onClick={() => document.getElementById('thumbnail')?.click()} />
            </div>
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

export default EditPinDetailsPopup;