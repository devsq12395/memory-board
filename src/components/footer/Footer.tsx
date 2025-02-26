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
      if (!pageUserID) {
        return;
      }

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
    <footer className="fixed bottom-0 md:absolute md:top-[85vh] h-[15vh] w-full min-w-[1200px] bg-blue-100 border-4 border-gray-100 rounded-lg shadow-lg">
      <div className="absolute left-[5px] bottom-[83px] md:left-[75px] md:bottom-[50px]">
        <img src={userData.avatar_url} alt="Avatar" className="w-[100px] h-[100px] md:w-[200px] md:h-[200px] border-4 border-gray-100 md:rounded-full shadow-md" />
      </div>
      <div className="mx-[10px] my-[10px] md:mx-[300px] md:my-[15px] flex flex-col gap-2">
        <h1 className="text-m md:text-3xl font-bold">
          {pageUserID ? `${userData.first_name} ${userData.last_name}` : 'Welcome to MemoryBoard.com!'}
        </h1>
        <hr className="text-m md:text-m w-full border-t border-gray-300" />
        <p className="text-sm md:text-m">
          {pageUserID ? userData.bio : 'Here are the past 50 memories created all over the world. Start sharing yours now!'}
        </p>
      </div>
    </footer>
  );
};

export default Footer;