import React, { useState, useEffect } from 'react';
import Popup from '../common/Popup';
import Button from '../common/Button'; // Assuming Button component is defined in this file

import { useUser } from '../contexts/UserContext';
import { getUserDetailsViaID } from '../../services/profile';

interface UserSettingsPopupProps {
  isShow: boolean;
  onClose: () => void;
}

const UserSettingsPopup: React.FC<UserSettingsPopupProps> = ({ isShow, onClose }) => {
  const userContext = useUser();
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    avatar_url: 'https://res.cloudinary.com/dkloacrmg/image/upload/v1717925908/cld-sample-3.jpg',
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!isShow || !userContext.uid) return;

      const userDetails = await getUserDetailsViaID(userContext.uid);
      if (userDetails) {
        setUserData({
          first_name: userDetails.first_name,
          last_name: userDetails.last_name,
          bio: userDetails.bio || '',
          avatar_url: userDetails.avatar_url || 'https://res.cloudinary.com/dkloacrmg/image/upload/v1717925908/cld-sample-3.jpg',
        });
      }
    };

    fetchUserDetails();
  }, [isShow, userContext.uid]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(import.meta.env.VITE_CLOUDINARY_API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const uploadedUrl = await uploadImageToCloudinary(file);
        setUserData(prevState => ({ ...prevState, avatar_url: uploadedUrl }));
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleAvatarUploadClick = () => {
    const fileInput = document.getElementById('avatar') as HTMLInputElement;
    fileInput.click();
  };

  const handleAvatarImageClick = () => {
    // Logic to handle avatar image click if needed
  };

  return (
    <Popup isShow={isShow} titleText="User Settings" onClose={onClose}>
      <div className="flex flex-col md:flex-row">
        {/* Left Side - User Details */}
        <div className="flex flex-col md:w-1/2">
          <div className="form-group">
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
            <input type="text" id="first_name" name="first_name" value={userData.first_name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div className="form-group">
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input type="text" id="last_name" name="last_name" value={userData.last_name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div className="form-group">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea id="bio" name="bio" rows={3} value={userData.bio} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none"></textarea>
          </div>
        </div>

        {/* Right Side - Avatar */}
        <div className="flex flex-col md:w-1/2 items-center">
          <h2 className="text-lg font-bold mb-4">Avatar</h2>
          <Button type="button" text="Choose File" styleType="file" onClick={handleAvatarUploadClick} />
          <input type="file" id="avatar" name="avatar" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <img src={userData.avatar_url} alt="Avatar Preview" onClick={handleAvatarImageClick} className="mt-2 h-35 w-35 object-cover mx-auto border border-gray-300 rounded-md cursor-pointer" />
        </div>
      </div>
    </Popup>
  );
};

export default UserSettingsPopup;