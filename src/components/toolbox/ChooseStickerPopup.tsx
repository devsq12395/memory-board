import React from 'react';
import Button from '../common/Button';
import { stickersData } from '../../data/stickersData';

interface ChooseStickerPopupProps {
  setStickerData: (sticker: { name: string; imageUrl: string }) => void;
  onClose: () => void;
}

const ChooseStickerPopup: React.FC<ChooseStickerPopupProps> = ({ setStickerData, onClose }) => {
  const handleStickerClick = (sticker: { name: string; imageUrl: string }) => {
    setStickerData(sticker);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="p-4 bg-white shadow-md rounded-md">

        <h2 className="text-lg font-bold mb-4 text-center">Choose a Sticker</h2>
        <hr className="my-4 border-t border-gray-200" />
        
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Sticker grid */}
          {Object.entries(stickersData).map(([region, stickers]) => (
            <div key={region} className="mb-5">
              <h3>{region}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {stickers.map((sticker) => (
                  <img
                    key={sticker.name}
                    src={sticker.imageUrl}
                    alt={sticker.name}
                    className="h-16 w-16 object-cover border border-gray-300 rounded-md cursor-pointer"
                    onClick={() => handleStickerClick(sticker)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <hr className="my-4 border-t border-gray-200" />

        {/* Buttons */}
        <div className="flex justify-end mt-4">
          <Button type="button" text="Cancel" styleType="secondary" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default ChooseStickerPopup;