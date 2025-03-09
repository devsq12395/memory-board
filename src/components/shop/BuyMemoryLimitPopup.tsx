import React, { useState, useEffect } from 'react';
import Popup from '../common/Popup';
import Button from '../common/Button';

import { get_shop_item, add_to_cart } from '../../services/shopService';
import { ShopItem } from '../types/types';
import LoadingCircle from '../common/LoadingCircle';

import { useShop } from '../contexts/ShopContext';
import { useUser } from '../contexts/UserContext';
import { SHOP_ITEM_IDS } from '../../constants/constants';

const BuyMemoryLimitPopup: React.FC = () => {
  const shopContext = useShop();
  const userContext = useUser();

  const [quantity, setQuantity] = useState(1);
  const [itemData, setItemData] = useState<ShopItem | null>(null);

  // Load data when opened
  useEffect(() => {
    if (!shopContext.isBuyMemoryPopupOpen) return;

    const loadItemData = async () => {
      try {
        const fetchItemData = await get_shop_item(SHOP_ITEM_IDS[0]);

        if (fetchItemData) {
          setItemData(fetchItemData);
        }
      } catch (error) {
        console.error('Error loading shop data:', error);
      }
    };

    loadItemData();
  }, [shopContext.isBuyMemoryPopupOpen]);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const closePopup = () => {
    shopContext.setIsBuyMemoryPopupOpen(false);
  };

  const addToCart = async () => {
    try {
      await add_to_cart(SHOP_ITEM_IDS[0], quantity, userContext.uid || '');
      shopContext.setIsCartPopupOpen(true);
      closePopup();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return <>
    { !itemData ? <>
      <Popup isShow={shopContext.isBuyMemoryPopupOpen} titleText="Buy Memory Limit" onClose={closePopup}>
        <LoadingCircle />
      </Popup>
    </> : <>
      <Popup isShow={shopContext.isBuyMemoryPopupOpen} titleText="Buy Memory Limit" onClose={closePopup}>
        <div className="flex flex-col items-center">
          <p>{itemData.description}</p>
          <div className="flex flex-row items-center border p-4 mt-4">
            {/* Picture Placeholder */}
            <img src={itemData.image_url} alt="Item" className="w-1/3 h-24 object-cover mr-4" />
            {/* Right Part */}
            <div className="flex flex-col justify-between">
              <span>{itemData.name}</span>
              <div className="flex flex-row items-center mt-2">
                <Button type="button" text="-" onClick={decreaseQuantity} className="border px-2" />
                <span className="mx-2">{quantity}</span>
                <Button type="button" text="+" onClick={increaseQuantity} className="border px-2" />
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-around w-full mt-4">
            <Button type="button" text="Buy" onClick={addToCart} className="bg-blue-500 text-white px-4 py-2 rounded" />
            <Button type="button" text="Cancel" onClick={closePopup} className="bg-gray-500 text-white px-4 py-2 rounded" />
          </div>
        </div>
      </Popup>
    </> }
  </>;
};

export default BuyMemoryLimitPopup;