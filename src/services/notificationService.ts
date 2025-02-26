import supabase from '../lib/supabase';
import { getDetailsOfUsers } from './profile';

interface Notification {
  owner_user_id: string;
  interactor_user_id: string;
  text: string;
  url: string;
  isInteracted: number;
}

export const createNotification = async (notification: Notification) => {
  const { data, error } = await supabase
    .from('notification')
    .insert([notification]);

  if (error) {
    console.error('Error creating notification:', error);
    return null;
  }
  return data;
};

export const interactWithNotification = async (id: number, isInteracted: number) => {
  const { data, error } = await supabase
    .from('notification')
    .update({ isInteracted })
    .eq('id', id);

  if (error) {
    console.error('Error interacting with notification:', error);
    return null;
  }
  return data;
};

// Updated getNotifications function using Supabase
export async function getNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notification')
    .select('*')
    .eq('owner_user_id', userId)
    .order('created_at', { ascending: false })
    .limit(99);

  if (data) {
      // Extract unique interactor IDs from notifications
      const interactorIds = Array.from(new Set(data.map((notification) => notification.interactor_user_id)));
      
      // Fetch user details, assuming getDetailsOfUsers returns an array of user objects with 'user_id' and 'avatar_url'
      const userDetails = await getDetailsOfUsers(interactorIds);
      
      // Filter out any null users, then create a map for quick lookup of avatar URL by user_id
      const filteredUserDetails = userDetails.filter(user => user !== null);
      const userAvatarMap = new Map(filteredUserDetails.map(user => [user.user_id, user.avatar_url]));
      
      // Augment each notification with an 'avatar' field
      const notificationsWithData = data.map(notification => ({
          ...notification,
          avatar: userAvatarMap.get(notification.interactor_user_id) || null
      }));
      
      return notificationsWithData;
  }

  if (error) {
      console.error('Error fetching notifications:', error);
  }
  return [];
}

export async function getNumberOfUninteractedNotifications(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('notification')
    .select('id', { count: 'exact', head: true })
    .eq('owner_user_id', userId)
    .eq('isInteracted', 0);

  if (error) {
    console.error('Error counting uninteracted notifications:', error);
    return 0;
  }
  return count || 0;
}