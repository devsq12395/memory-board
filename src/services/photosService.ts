import supabase from '../lib/supabase';

// Function to add a photo using Supabase
export async function addPhoto(memory_id: string, image_url: string) {
    try {
      const { data, error } = await supabase
        .from('memory_photo')
        .insert({ memory_id, image_url })
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

// Function to get photos of a specific memory using Supabase
export async function getPhotosOfMemory(memory_id: string) {
  try {
    const { data, error } = await supabase
        .from('memory_photo')
        .select('*')
        .eq('memory_id', memory_id);

    if (error) {
      console.error('Error getting photos of memory:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error getting photos of memory:', error);
    throw error;
  }
}

// Function to get photo data using Supabase
export async function getPhotoData(photo_id: string): Promise<{ image_url: string; desc: string } | null> {
    try {
        const { data, error } = await supabase
            .from('memory_photo')
            .select('image_url, desc')
            .eq('id', photo_id)
            .single();

        if (error) {
            console.error('Error fetching photo data:', error);
            return null;
        }

        return data || null;
    } catch (error) {
        console.error('Unexpected error fetching photo data:', error);
        return null;
    }
}