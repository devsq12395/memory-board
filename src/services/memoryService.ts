import supabase from '../lib/supabase';
import { createNotification } from './notificationService';
import { getDetailsOfUsers } from './profile';

import { Comment } from '../components/types/types';

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
      .select('title, thumbnail_url, bottom_img_url, desc, date, user_id')
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

export async function getLatestMemories(limit: number) {
  try {
    const { data, error } = await supabase
      .from('memory')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching latest memories:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching latest memories:', error);
    throw error;
  }
}

export async function getCommentsByMemoryId(memoryId: string): Promise<Comment[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_comments_by_memory_id', { memory_id: memoryId });

    if (error) {
      console.error('Error fetching comments for memory:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching comments for memory:', error);
    throw error;
  }
}

export async function addComment(memoryId: string, userId: string, text: string) {
  try {
    // Get memory data
    const memoryData = await getMemoryData(memoryId);
    if (!memoryData) {
      throw new Error('Memory not found');
    }

    // Insert comment
    const { data, error } = await supabase
      .from('memory_comment')
      .insert({ memory_id: memoryId, commenter_user_id: userId, text })
      .select()
      .single();

    if (error) {
      console.error('Error adding comment:', error);
      throw error;
    }

    // Notification section
    if (memoryData.user_id != userId) {
      const [commenterDetails, ownerDetails] = await getDetailsOfUsers([userId, memoryData.user_id]);

      if (!commenterDetails) {
        throw new Error('Commenter details not found');
      }
      if (!ownerDetails) {
        throw new Error('Memory owner details not found');
      }

      // Add notification
      const notification = {
        owner_user_id: memoryData.user_id,
        interactor_user_id: userId,
        text: `${commenterDetails.first_name} ${commenterDetails.last_name} commented on your memory: "${text}"`,
        url: `/memories/${memoryId}`,
        isInteracted: 0
      };

      await createNotification(notification);
    }

    return data;
  } catch (error) {
    console.error('Unexpected error adding comment:', error);
    throw error;
  }
}

export async function deleteComment(commentId: string) {
  try {
    const { error } = await supabase
      .from('memory_comment')
      .update({ is_deleted: true })
      .eq('id', commentId);

    if (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting comment:', error);
    throw error;
  }
}