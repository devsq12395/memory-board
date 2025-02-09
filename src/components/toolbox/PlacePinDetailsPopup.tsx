import React, { useState } from 'react';

const PlacePinDetailsPopup: React.FC = () => {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [magnetPreview, setMagnetPreview] = useState<string | null>(null);

  return (
    <div className="place-pin-details-popup p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">Let's add details to this memory</h2>
      <form className="space-y-4">
        <div className="form-group">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" id="title" name="title" placeholder="Enter title" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div className="form-group">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" name="description" placeholder="Enter description" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">Thumbnail Image</label>
          <input type="file" id="thumbnail" name="thumbnail" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setThumbnailPreview(reader.result as string);
              };
              reader.readAsDataURL(file);
            }
          }} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
          {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail Preview" className="mt-2 h-20 w-20 object-cover" />}
        </div>
        <div className="form-group">
          <label htmlFor="magnet" className="block text-sm font-medium text-gray-700">Magnet Image</label>
          <select id="magnet" name="magnet" onChange={(e) => {
            const selectedImage = e.target.value;
            setMagnetPreview(selectedImage);
          }} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option value="default1.png">Default Image 1</option>
            <option value="default2.png">Default Image 2</option>
            <option value="default3.png">Default Image 3</option>
          </select>
          {magnetPreview && <img src={magnetPreview} alt="Magnet Preview" className="mt-2 h-20 w-20 object-cover" />}
        </div>
      </form>
    </div>
  );
};

export default PlacePinDetailsPopup;