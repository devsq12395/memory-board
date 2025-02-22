import React, { useState } from 'react';
import Popup from '../common/Popup';
import { useToolbox } from '../contexts/ToolboxContext';

const TakePhotoPopup: React.FC = () => {
  const toolboxContext = useToolbox();

  const onClose = () => {
    toolboxContext.setSharePhotoUrl(null);
    toolboxContext.setSharePhotoPopupIsOpen(false);
  };

  return (
    <Popup isShow={toolboxContext.sharePhotoPopupIsOpen} titleText="Share your memories" onClose={onClose}>
      {toolboxContext.sharePhotoUrl ? (
        <div>
          <img src={toolboxContext.sharePhotoUrl} alt="Shared memory" className="w-full h-auto" />
        
        </div>
      ) : 
      <div>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="loader border-t-4 border-b-4 border-gray-300 rounded-full w-8 h-8 mb-4 animate-spin"></div>
          <p>Preparing photo...</p>
        </div>
      </div>
    } 
    </Popup>
  );
}

export default TakePhotoPopup;