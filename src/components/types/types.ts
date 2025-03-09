export interface Comment {
  id: string;
  avatar_url: string;
  first_name: string;
  last_name: string;
  commenter_user_id: string;
  created_at: string;
  text: string;
  is_deleted: boolean;
}

export interface CartItem {
  // Default structure of shop_cart_item from supabase
  id: string;
  created_at: string;
  shop_item_id: string;
  user_id: string;
  quantity: number;

  // Derived fields - Taken from shop_item table
  name: string;
  description: string;
  image_url: string;

  price: number; // This one will be calculated
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
}