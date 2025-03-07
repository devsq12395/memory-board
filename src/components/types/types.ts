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