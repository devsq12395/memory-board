import { useState, useEffect } from "react";
import Popup from "../common/Popup";
import LoadingCircle from "../common/LoadingCircle";
import Button from "../common/Button";

import { useShop } from "../contexts/ShopContext";
import { useUser } from "../contexts/UserContext";

import { get_cart_items, handleCheckout } from "../../services/shopService";
import { CartItem } from "../types/types";

const ShopCartPopup: React.FC = () => {
  const shopContext = useShop();
  const userContext = useUser();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart data when opened
  useEffect(() => {
    if (!shopContext.isCartPopupOpen || !userContext.uid) return;

    const loadCartData = async () => {
      try {
        const fetchCartItems = await get_cart_items(userContext.uid || '');
        setCartItems(fetchCartItems);
      } catch (error) {
        console.error('Error loading cart data:', error);
      }
    };

    loadCartData();
  }, [shopContext.isCartPopupOpen]);

  const closePopup = () => {
    shopContext.setIsCartPopupOpen(false);
  };

  const checkout = async () => {
    try {
      await handleCheckout();
      closePopup();
    } catch (error) {
      console.error('Error checking out:', error);
    }
  };

  return <>{
    !cartItems ? 
    <Popup isShow={shopContext.isCartPopupOpen} titleText="Cart" onClose={closePopup}>
      <LoadingCircle />
    </Popup> : 
    <Popup isShow={shopContext.isCartPopupOpen} titleText="Cart" onClose={closePopup}>
      <div className="flex flex-col items-center h-full">
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="flex flex-col justify-between w-full h-full">
              {/* Top elements */}
              <div className="flex flex-col justify-between w-full h-full">
                <ul className="w-full h-[75%] overflow-y-auto">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex justify-between items-center border-b py-2">
                      <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                      <div className="flex-1">
                        <p className="font-bold">{item.name}</p>
                        <p>{item.description}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-bold">${item.price.toFixed(2)}</p>
                    </li>
                  ))}
                </ul>
                <hr className="border-t border-gray-700" />

                <div className="w-full flex justify-end">
                  <p className="font-bold">Total: ${cartItems.reduce((total, item) => total + item.price, 0).toFixed(2)}</p>
                </div>
              </div>

              {/* Bottom elements */}
              <div className="mt-4 flex justify-center">
                <Button 
                  type="button"
                  styleType="primary"
                  text="Checkout" 
                  onClick={checkout} 
                />
              </div>
            </div>
          </>
        )}
      </div>
    </Popup>
  }</>
};

export default ShopCartPopup;