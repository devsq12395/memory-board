import React from "react";
import Popup from "../common/Popup";
import { useToolbox } from "../contexts/ToolboxContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const TakePhotoPopup: React.FC = () => {
  const toolboxContext = useToolbox();

  const onClose = () => {
    toolboxContext.setSharePhotoUrl(null);
    toolboxContext.setSharePhotoPopupIsOpen(false);
  };

  // Function to share on Facebook
  const shareOnFacebook = () => {
    if (toolboxContext.sharePhotoUrl) {
      const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        toolboxContext.sharePhotoUrl
      )}`;
      window.open(facebookShareUrl, "_blank", "width=600,height=400");
    }
  };

  // Function to share on Twitter
  const shareOnTwitter = () => {
    if (toolboxContext.sharePhotoUrl) {
      const imageUrl = toolboxContext.sharePhotoUrl;
      const text = 'Check out this memory on MemoryBoard!'; // Customize your text
      const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(imageUrl)}&text=${encodeURIComponent(text)}`;
      window.open(twitterShareUrl, '_blank', 'width=600,height=400');
    }
  };

  // Function to download the image
  const downloadImage = () => {
    const imageUrl = toolboxContext.sharePhotoUrl;
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'memory.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Popup
      isShow={toolboxContext.sharePhotoPopupIsOpen}
      titleText="Share your memories"
      onClose={onClose}
    >
      {toolboxContext.sharePhotoUrl ? (
        <div className="flex flex-col items-center">
          <img
            src={toolboxContext.sharePhotoUrl}
            alt="Shared memory"
            className="w-full h-auto mb-4"
          />
          <div className="flex space-x-4">
            {/* Facebook Share Button */}
            <button
              onClick={shareOnFacebook}
              className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition cursor-pointer"
            >
              <FontAwesomeIcon icon={faFacebook} className="w-5 h-5 mr-2" />
            </button>
            {/* Twitter Share Button */}
            <button
              onClick={shareOnTwitter}
              className="flex items-center justify-center bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition cursor-pointer"
            >
              <FontAwesomeIcon icon={faXTwitter} className="w-5 h-5 mr-2" />
            </button>
            {/* Download Button */}
            <button
              onClick={downloadImage}
              className="flex items-center justify-center bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition cursor-pointer"
            >
              <FontAwesomeIcon icon={faDownload} className="w-5 h-5 mr-2" />
              Download Image
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="loader border-t-4 border-b-4 border-gray-300 rounded-full w-8 h-8 mb-4 animate-spin"></div>
          <p>Preparing photo...</p>
        </div>
      )}
    </Popup>
  );
};

export default TakePhotoPopup;
