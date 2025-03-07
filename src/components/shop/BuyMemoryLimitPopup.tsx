import React, { useState } from 'react';
import Popup from '../common/Popup';
import Button from '../common/Button';

import { usePopups } from '../contexts/PopupsContext';

const BuyMemoryLimitPopup: React.FC = () => {
  const popupsContext = usePopups();

  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const closePopup = () => {
    popupsContext.setIsBuyMemoryPopupOpen(false);
  };

  return (
    <Popup isShow={popupsContext.isBuyMemoryPopupOpen} titleText="Buy Memory Limit" onClose={closePopup}>
      <div className="flex flex-col items-center">
        <p>Increase the limit in your memory board for just $1</p>
        <div className="flex flex-row items-center border p-4 mt-4">
          {/* Picture Placeholder */}
          <div className="w-1/3 bg-gray-200 h-24 mr-4"></div>
          {/* Right Part */}
          <div className="flex flex-col justify-between">
            <span>+5 Memory Limit</span>
            <div className="flex flex-row items-center mt-2">
              <Button type="button" text="-" onClick={decreaseQuantity} className="border px-2" />
              <span className="mx-2">{quantity}</span>
              <Button type="button" text="+" onClick={increaseQuantity} className="border px-2" />
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-around w-full mt-4">
          <Button type="button" text="Buy" className="bg-blue-500 text-white px-4 py-2 rounded" />
          <Button type="button" text="Cancel" onClick={closePopup} className="bg-gray-500 text-white px-4 py-2 rounded" />
        </div>
      </div>
    </Popup>
  );
};

export default BuyMemoryLimitPopup;