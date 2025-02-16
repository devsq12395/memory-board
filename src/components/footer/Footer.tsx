import React, { useEffect, useState } from 'react';
import { getUserDetailsViaID } from '../../services/profile';

interface FooterProps {
  pageUserID: string | null;
}

const Footer = ({ pageUserID }: FooterProps) => {
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    avatar_url: 'https://res.cloudinary.com/dkloacrmg/image/upload/v1717925908/cld-sample-3.jpg',
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!pageUserID) return;

      const userDetails = await getUserDetailsViaID(pageUserID);
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
  }, [pageUserID]);

  return (
    <footer className="absolute top-[85vh] h-[15vh] w-full min-w-[1200px] bg-blue-100">
      <div className="absolute left-[75px] bottom-[50px]">
        <img src={userData.avatar_url} alt="Avatar" className="w-[200px] h-[200px] rounded-full" />
      </div>
      <h1 className="mx-[300px] my-[15px] text-3xl font-bold">{userData.first_name}'s Memory Board</h1>
      <hr className="mx-[300px] my-[15px] border-t border-gray-300" />

      <p className="mx-[300px] text-m">{userData.bio}</p>
    </footer>
  );
};

export default Footer;