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
        {Object.entries(stickersData).map(([region, stickers]) => (
          <div key={region} style={{ overflowX: 'auto', whiteSpace: 'nowrap', marginBottom: '20px' }}>
            <h3>{region}</h3>
            {stickers.map((sticker, index) => (
              <img
                key={index}
                src={sticker.imageUrl}
                alt={sticker.name}
                onClick={() => handleStickerClick(sticker)}
                style={{ display: 'inline-block', cursor: 'pointer', margin: '0 5px', width: '100px', height: '100px' }}
              />
            ))}
          </div>
        ))}
        <div className="flex justify-end mt-4">
          <Button type="button" text="Close" styleType="secondary" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default ChooseStickerPopup;