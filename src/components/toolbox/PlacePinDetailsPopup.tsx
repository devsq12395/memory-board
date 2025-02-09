import React, { useState } from 'react';
import { updateMemoryDetails, deleteMemory } from '../../services/mapService';
import { useToolbox } from '../contexts/ToolboxContext';
import Button from '../common/Button';

const MAGNETS = [
  { name: 'Magnet 1', imageUrl: 'https://example.com/magnet1.png' },
  { name: 'Magnet 2', imageUrl: 'https://example.com/magnet2.png' },
  { name: 'Magnet 3', imageUrl: 'https://example.com/magnet3.png' },
];

const PlacePinDetailsPopup: React.FC = () => {
  const toolboxContext = useToolbox();

  const [thumbnailImg, setThumbnailImg] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    magnet: '',
    magnetName: '',
    magnetImageUrl: ''
  });
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const { title, date, description, magnetImageUrl } = formData;

      const result = await updateMemoryDetails(
        toolboxContext.addingNewMemoryId || '',
        title,
        date,
        description,
        thumbnailImg,
        magnetImageUrl
      );
      console.log('Memory updated:', result);
      toolboxContext.setAddingNewMemoryId(null);
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
    // Put delayed refresh pin here
    console.log('Cancel button clicked');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="p-4 bg-white shadow-md rounded-md">
        <h2 className="text-lg font-bold mb-4 text-center">Let's add details to this memory</h2>
        <hr className="my-4 border-gray-300" />

        <form className="space-y-4 grid grid-cols-2 gap-4" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          <div className="col-span-2 md:col-span-1">

            {/* Text Form fields */}
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
              <textarea id="description" name="description" rows={3} placeholder="Enter description" value={formData.description} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1 border-l border-gray-300 pl-4">
            {/* Thumbnail Image Form Group */}
            <div className="form-group">
              <Button type="button" text="Choose File" styleType="file" onClick={() => document.getElementById('thumbnail')?.click()} />
              <input type="file" id="thumbnail" name="thumbnail" accept="image/*" onChange={handleInputChange} className="hidden" />
              <img src={thumbnailImg || 'default-thumbnail.png'} alt="Thumbnail Preview" className="mt-2 h-20 w-20 object-cover mx-auto border border-gray-300 rounded-md" />
              <p className="text-center text-sm text-gray-500 mt-2">{uploadMessage}</p>
            </div>

            {/* Magnet Image Form Group */}
            <div className="form-group">
              <label htmlFor="magnet" className="block text-sm font-medium text-gray-700">Magnet Image</label>
              <select id="magnet" name="magnet" value={formData.magnetName} onChange={(e) => {
                const selectedMagnet = MAGNETS.find(magnet => magnet.name === e.target.value);
                if (selectedMagnet) {
                  setFormData(prevState => ({
                    ...prevState,
                    magnetName: selectedMagnet.name,
                    magnetImageUrl: selectedMagnet.imageUrl
                  }));
                }
              }}>
                {MAGNETS.map(magnet => (
                  <option key={magnet.name} value={magnet.name}>{magnet.name}</option>
                ))}
              </select>
              <img src={formData.magnetImageUrl} alt="Magnet Preview" className="mt-2 h-20 w-20 object-cover mx-auto border border-gray-300 rounded-md" />
            </div>
          </div>
          <div className="flex justify-end space-x-2 col-span-2 mt-4">
            <Button type="submit" text="Submit" styleType="primary" disabled={uploading} />
            <Button type="button" text="Cancel" styleType="secondary" disabled={uploading} onClick={handleCancel} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlacePinDetailsPopup;