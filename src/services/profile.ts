import supabase from '../lib/supabase';
import axios from 'axios';

export interface UserDetails {
  user_id: string;
  first_name: string;
  last_name: string;
  user_name: string;
  bio?: string;
  avatar_url?: string;
}

export async function getUserIdHasProfile(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profile')
      .select('user_id')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error(`Error fetching user profile: ${error.message}`);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error(`Error fetching user profile`);
    return false;
  }
}

export async function createUserProfile(user_id: string, first_name: string, last_name: string, user_name: string): Promise<any> {
  try {
    // Check if the username already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('profile')
      .select('user_name')
      .eq('user_name', user_name)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // Ignore "No rows found" error
      console.error('Error checking username existence:', checkError);
      throw checkError;
    }

    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Proceed with creating the user profile
    const { data, error } = await supabase
      .from('profile')
      .insert({ user_id, first_name, last_name, user_name });

    if (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    throw error;
  }
}

export async function getUserDetails(user_name: string): Promise<UserDetails | null> {
  try {
    const { data, error } = await supabase
      .from('profile')
      .select('user_id, first_name, last_name, bio, avatar_url, user_name')
      .eq('user_name', user_name)
      .single();

    if (error) {
      console.error('Error fetching user details:', error);
      return null;
    }

    data.avatar_url = data.avatar_url || 'https://res.cloudinary.com/dkloacrmg/image/upload/v1735984918/sq-traveller/d1smxewhudxzqaw2v0br.png';

    return data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
}

export async function getUserDetailsViaID(userId: string): Promise<UserDetails | null> {
  try {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error("Error fetching user details:", error);
      return null;
    }

    return data as UserDetails;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
}

export async function getDetailsOfUsers(user_ids: string[]): Promise<(UserDetails | null)[]> {
  try {
    const userDetailsList: (UserDetails | null)[] = [];

    for (const userId of user_ids) {
      const hasProfile = await getUserIdHasProfile(userId);
      if (!hasProfile) {
        console.error(`Profile not found for user ID: ${userId}`);
        userDetailsList.push(null);
        continue;
      }

      const userDetails = await getUserDetailsViaID(userId);
      if (!userDetails) {
        console.error(`Details not found for user ID: ${userId}`);
        userDetailsList.push(null);
        continue;
      }

      userDetailsList.push(userDetails);
    }

    return userDetailsList;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return [];
  }
}

export async function checkIfNameExists(first_name: string, last_name: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profile')
      .select('first_name')
      .eq('first_name', first_name)
      .eq('last_name', last_name)
      .single();

    if (error) {
      console.error('Error checking username existence:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in checkIfUsernameExists:', error);
    return false;
  }
}

export async function uploadAvatar(file: File): Promise<string | undefined> {
  if (!file) return;

  try {
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const cloudinaryUrl = import.meta.env.VITE_CLOUDINARY_API_URL;

    if (!uploadPreset || !cloudinaryUrl) {
      console.error("Cloudinary environment variables are missing.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await axios.post(cloudinaryUrl, formData);
    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
}

interface UserUpdate {
  first_name?: string;
  last_name?: string;
  user_name?: string;
  bio?: string;
  avatar_url?: string;
}

export async function updateUserDetail(userId: string, updates: UserUpdate): Promise<any> {
  if (!updates.first_name && !updates.last_name && !updates.bio) return;

  try {
    const { data, error } = await supabase
      .from('profile')
      .update(updates)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error updating user details:", error);
    throw error;
  }
}