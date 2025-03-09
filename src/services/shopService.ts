import { CartItem, ShopItem } from '../components/types/types';
import { useUser } from '../components/contexts/UserContext';
import { loadStripe } from "@stripe/stripe-js";
import supabase from '../lib/supabase';

import { SHOP_ITEM_IDS } from '../constants/constants';
import { updateMemoryLimit } from './profile';

export const get_shop_item = async (id: string): Promise<ShopItem | null> => {
  const { data, error } = await supabase
    .from('shop_item')
    .select('*')
    .eq('id', id);
  if (error) throw new Error(error.message);
  return data.length > 0 ? data[0] : null;
};

export const get_cart_items = async (userId: string): Promise<CartItem[]> => {
  const { data: cartItems, error: cartError } = await supabase
    .from('shop_cart_item')
    .select('*')
    .eq('user_id', userId);
  if (cartError) throw new Error(cartError.message);

  const cartItemsWithDetails = await Promise.all(cartItems.map(async (cartItem) => {
    const shopItem = await get_shop_item(cartItem.shop_item_id);
    return {
      ...cartItem,
      name: shopItem?.name || '',
      description: shopItem?.description || '',
      image_url: shopItem?.image_url || '',
      price: (shopItem?.price || 0) * cartItem.quantity,
    };
  }));

  return cartItemsWithDetails;
};

export const add_to_cart = async (shopItemId: string, quantity: number, uid: string) => {
  if (!uid) throw new Error('User not authenticated');

  // Check if the item already exists in the cart
  const { data: existingItems, error: fetchError } = await supabase
    .from('shop_cart_item')
    .select('id, quantity')
    .eq('shop_item_id', shopItemId)
    .eq('user_id', uid);

  if (fetchError) throw new Error(fetchError.message);

  if (existingItems && existingItems.length > 0) {
    // Item exists, update the quantity
    const existingItem = existingItems[0];
    const newQuantity = existingItem.quantity + quantity;

    const { error: updateError } = await supabase
      .from('shop_cart_item')
      .update({ quantity: newQuantity })
      .eq('id', existingItem.id);

    if (updateError) throw new Error(updateError.message);
    return { id: existingItem.id, quantity: newQuantity };
  } else {
    // Item does not exist, insert a new one
    const { data, error } = await supabase
      .from('shop_cart_item')
      .insert({
        shop_item_id: shopItemId,
        user_id: uid,
        quantity,
      });

    if (error) throw new Error(error.message);
    return data;
  }
};

export const processCartItems = async (userId: string) => {
  try {
    const cartItems = await get_cart_items(userId);

    for (const item of cartItems) {
      try {
        switch (item.shop_item_id) {
          // First item - Add Memory Limit
          case SHOP_ITEM_IDS[0]:
            await updateMemoryLimit(userId, item.quantity * 10);
            break;
          default:
            break;
        }

        // Delete item from cart after processing
        const { error: deleteError } = await supabase
          .from('shop_cart_item')
          .delete()
          .eq('id', item.id);

        if (deleteError) {
          console.error(`Error deleting item: ${item.name}`, deleteError);
        }
      } catch (error) {
        console.error(`Error processing item: ${item.name}`, error);
        throw error;
      }
    }

    console.log('Cart items processed successfully.');
  } catch (error) {
    console.error('Error processing cart items:', error);
    throw error;
  }
};

export const handleCheckout = async (cartItems: CartItem[]) => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

    const priceTotal = JSON.stringify(cartItems.reduce((total, item) => total + item.price, 0));
    const cartItemsBody = JSON.stringify({
      productName: "Total Price",
      amount: priceTotal,
    });

    console.log (cartItemsBody);

    if (!cartItemsBody) {
      throw new Error("Cart items error");
    }

    const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: cartItemsBody,
    });

    // Log response to check for issues
    const result = await response.json();
    console.log("Checkout session response:", result);

    if (!result.sessionId) {
      throw new Error("Session ID is missing from the response");
    }

    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");
    await stripe?.redirectToCheckout({ sessionId: result.sessionId });
  } catch (error) {
    console.error("Error processing checkout:", error);
  }
};
