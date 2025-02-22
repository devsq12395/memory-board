import React, { useState } from 'react';
import { updateMemoryDetails, deleteMemory } from '../../services/memoryService';
import { useToolbox } from '../contexts/ToolboxContext';
import Button from '../common/Button';

interface PlacePinDetailsPopupProps {
  stickerData: { name: string; imageUrl: string };
  setIsChooseStickerPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTriggerDelayedRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlacePinDetailsPopup: React.FC<PlacePinDetailsPopupProps> = ({ stickerData, setIsChooseStickerPopupOpen, setIsTriggerDelayedRefresh }) => {
  const toolboxContext = useToolbox();

  const [thumbnailImg, setThumbnailImg] = useState<string>('https://res.cloudinary.com/dkloacrmg/image/upload/v1739507939/memory-board/pbmgfsmpejt3wulrdruy.png');
  const [formData, setFormData] = useState({
    title: '',
    date: new Date('2025-01-01').toISOString().split('T')[0],
    description: '',
    sticker: '',
    stickerName: ''
  });
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const { title, date, description } = formData;

      const result = await updateMemoryDetails(
        toolboxContext.addingNewMemoryId || '',
        title,
        date,
        description,
        thumbnailImg,
        stickerData.imageUrl
      );
      console.log('Memory updated:', result);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  if (!toolboxContext.isPlacingPinPopupOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="p-4 bg-white shadow-md rounded-md w-1/2 h-[72%] min-w-[500px] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4 text-center">Let's add details to this memory</h2>
        <hr className="my-4 border-gray-300" />
        {toolboxContext.addingNewMemoryId ? (
          <form className="space-y-4 grid grid-cols-2 gap-4" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
            <div className="col-span-2 md:col-span-1">

              {/* Text Form fields */}
              <div className="flex flex-col gap-4">
                <div className="form-group">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                  <input type="text" id="title" name="title" placeholder="Enter title" value={formData.title} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div className="form-group">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                  <input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div className="form-group">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea id="description" name="description" rows={3} placeholder="Enter description" value={formData.description} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none"></textarea>
                </div>
              </div>
              </div>

            <div className="col-span-2 md:col-span-1 border-l border-gray-300 pl-4 pb-22">
              {/* Thumbnail Image Form Group */}
              <div className="form-group">
              <label htmlFor="sticker" className="block text-sm font-medium text-gray-700">Thumbnail Image</label>
                <Button type="button" text="Choose File" styleType="file" onClick={() => document.getElementById('thumbnail')?.click()} />
                <input type="file" id="thumbnail" name="thumbnail" accept="image/*" onChange={handleInputChange} className="hidden" />
                <img src={thumbnailImg || 'https://res.cloudinary.com/dkloacrmg/image/upload/v1717925908/cld-sample-3.jpg'} alt="Thumbnail Preview" className="mt-2 h-35 w-35 object-cover mx-auto border border-gray-300 rounded-md" />
                <p className="text-center text-sm text-gray-500 mt-2">{uploadMessage}</p>
              </div>

              {/* Sticker Image Form Group */}
              <div className="form-group">
                <label htmlFor="sticker" className="block text-sm font-medium text-gray-700">Sticker Image</label>
                <Button type="button" text="Choose Sticker" styleType="file" onClick={() => setIsChooseStickerPopupOpen(true)} />
                <img src={stickerData.imageUrl} alt="Sticker Preview" className="mt-2 h-35 w-35 object-cover mx-auto border border-gray-300 rounded-md" />
              </div>
            </div>
            <div className="flex justify-end space-x-2 col-span-2 mt-2">
              <Button type="submit" text="Submit" styleType="primary" disabled={uploading} />
              <Button type="button" text="Cancel" styleType="secondary" disabled={uploading} onClick={handleCancel} />
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="loader border-t-4 border-b-4 border-gray-300 rounded-full w-8 h-8 mb-4 animate-spin"></div>
            <p>Preparing this memory pin...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacePinDetailsPopup;