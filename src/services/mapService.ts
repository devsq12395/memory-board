import supabase from '../lib/supabase';

export async function getUserMemories(user_id: string) {
  try {
    const { data, error } = await supabase
      .from('memory')
      .select('title, thumbnail_url, bottom_img_url, pos_lat, pos_lng')
      .eq('user_id', user_id);

    if (error) {
      console.error('Error fetching user memories:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching user memories:', error);
    throw error;
  }
}

export async function addUserMemory(user_id: string, pos_lat: number, pos_lng: number) {
  try {
    const { data, error } = await supabase
      .from('memory')
      .insert({ user_id, pos_lat, pos_lng })
      .select()
      .single();

    if (error) {
      console.error('Error adding user memory:', error);
      throw error;
    }

    return data;
} catch (error) {
    console.error('Unexpected error adding user memory:', error);
    throw error;
  }
}