export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Album {
  id: string;
  user_id: string;
  name: string;
  cover_url: string | null;
  photo_count?: number;
  created_at: string;
}

export interface Photo {
  id: string;
  user_id: string;
  album_id: string | null;
  filename: string;
  url: string;
  thumb_url: string | null;
  type: 'image' | 'video';
  size: number;
  width: number | null;
  height: number | null;
  is_favorite: boolean;
  is_deleted: boolean;
  deleted_at: string | null;
  created_at: string;
}

export type SortOption = 'newest' | 'oldest' | 'name' | 'size';
export type FilterOption = 'all' | 'image' | 'video' | 'favorite';

export interface UploadItem {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
}
