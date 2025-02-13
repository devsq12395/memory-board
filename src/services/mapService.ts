import supabase from '../lib/supabase';

export async function getUserMemories(user_id: string) {
  try {
    const { data, error } = await supabase
      .from('memory')
      .select('id, title, thumbnail_url, bottom_img_url, pos_lat, pos_lng')
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

export async function updateMemoryDetails(
  memory_id: string, 
  title: string, 
  date: string, 
  description: string, 
  thumbnail_url: string, 
  bottom_img_url: string
) {
  try {
    const { data, error } = await supabase
      .from('memory')
      .update({
        title,
        date,
        desc: description,
        thumbnail_url,  
        bottom_img_url  
      })
      .eq('id', memory_id);

    if (error) {
      console.error('Error updating memory details:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error updating memory details:', error);
    throw error;
  }
}

export async function deleteMemory(memory_id: string) {
  try {
    const { error } = await supabase
      .from('memory')
      .delete()
      .eq('id', memory_id);

    if (error) {
      console.error('Error deleting memory:', error);
      throw error;
    }
  } catch (error) {
    console.error('Unexpected error deleting memory:', error);
    throw error;
  }
}

export const getMemoryData = async (memoryId: string) => {
  try {
    const { data, error } = await supabase
      .from('memory')
      .select('title, thumbnail_url, bottom_img_url, desc, date')
      .eq('id', memoryId)
      .single();

    if (error) {
      throw new Error(`Error fetching memory data: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch memory data:', error);
    throw error;
  }
};
