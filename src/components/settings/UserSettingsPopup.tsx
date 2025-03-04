import React, { useState, useEffect } from 'react';
import Popup from '../common/Popup';
import Button from '../common/Button'; // Assuming Button component is defined in this file

import { useUser } from '../contexts/UserContext';
import { getUserDetailsViaID, updateUserDetail } from '../../services/profile';

interface UserSettingsPopupProps {
  isShow: boolean;
  onClose: () => void;
}

const UserSettingsPopup: React.FC<UserSettingsPopupProps> = ({ isShow, onClose }) => {
  const userContext = useUser();
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    user_name: '',
    bio: '',
    avatar_url: 'https://res.cloudinary.com/dkloacrmg/image/upload/v1717925908/cld-sample-3.jpg',
  });

  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!isShow || !userContext.uid) return;

      const userDetails = await getUserDetailsViaID(userContext.uid);
      if (userDetails) {
        setUserData({
          first_name: userDetails.first_name,
          last_name: userDetails.last_name,
          user_name: userDetails.user_name,
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
      setUploadStatus('Uploading...');
      try {
        const uploadedUrl = await uploadImageToCloudinary(file);
        setUserData(prevState => ({ ...prevState, avatar_url: uploadedUrl }));
        setUploadStatus('Upload complete!');
        setTimeout(() => setUploadStatus(null), 4000);
      } catch (error) {
        console.error('Error uploading image:', error);
        setUploadStatus('Upload failed!');
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

  const handleSaveProfile = async () => {
    try {
      if (!userContext.uid) return;
      await updateUserDetail(userContext.uid, {
        first_name: userData.first_name,
        last_name: userData.last_name,
        bio: userData.bio,
        avatar_url: userData.avatar_url || 'https://res.cloudinary.com/dkloacrmg/image/upload/v1717925908/cld-sample-3.jpg',
      });
      setSaveStatus('User settings saved');
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveStatus('Error saving user settings');
    }
  };

  return (
    <Popup isShow={isShow} titleText="User Settings" onClose={onClose}>
      {/* Left Side - User Details */}
      <div className="flex flex-col gap-3">
        <div className="form-group">
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700"><strong>First Name</strong> ({userData.first_name.length}/50)</label>
          <input type="text" id="first_name" name="first_name" value={userData.first_name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" maxLength={50} />
        </div>
        <div className="form-group">
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700"><strong>Last Name</strong> ({userData.last_name.length}/50)</label>
          <input type="text" id="last_name" name="last_name" value={userData.last_name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" maxLength={50} />
        </div>
        <div className="form-group">
          <label htmlFor="user_name" className="block text-sm font-medium text-gray-700"><strong>Unique User Name</strong> ({userData.user_name.length}/50)</label>
          <input type="text" id="user_name" name="user_name" value={userData.user_name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" maxLength={50} />
        </div>
        <div className="form-group">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700"><strong>Bio</strong> ({userData.bio.length}/200)</label>
          <textarea id="bio" name="bio" rows={3} value={userData.bio} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" maxLength={200}></textarea>
        </div>
      </div>

      {/* Right Side - Avatar */}
      <div className="flex flex-col justify-between w-[100%] h-[100%]">
        <div className="flex flex-col w-full items-center">
          <h2 className="mb-2 text-2xl font-bold w-full text-left">Avatar</h2>
          <hr className="mb-4 border-t border-gray-300 w-full" />

          <input type="file" id="avatar" name="avatar" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <img src={userData.avatar_url} alt="Avatar Preview" onClick={handleAvatarImageClick} className="mb-6 h-60 w-60 object-cover mx-auto border border-gray-300 rounded-md cursor-pointer" />
          <Button type="button" text="Choose File" styleType="file" onClick={handleAvatarUploadClick} />
          {uploadStatus && <p className={`mt-2 text-sm ${uploadStatus === 'Upload complete!' ? 'text-green-500' : 'text-red-500'}`}>{uploadStatus}</p>}
          {saveStatus && <p className={`mt-2 text-sm ${saveStatus === 'User settings saved' ? 'text-green-500' : 'text-red-500'}`}>{saveStatus}</p>}
        </div>
        <div className="flex flex-row w-full justify-end">
          <Button type="button" text="Save Profile" styleType="primary" onClick={handleSaveProfile} className="mt-4 self-end" />
        </div>
      </div>
    </Popup>
  );
};

export default UserSettingsPopup;