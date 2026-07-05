import { Images, LayoutGrid, Upload, Search, Settings, Heart, Trash2 } from 'lucide-react';

export const mainNav = [
  { to: '/gallery', label: 'Gallery', icon: Images },
  { to: '/albums', label: 'Albums', icon: LayoutGrid },
  { to: '/upload', label: 'Upload', icon: Upload },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export const sideExtra = [
  { to: '/favorites', label: 'Favorites', icon: Heart },
  { to: '/trash', label: 'Recently Deleted', icon: Trash2 },
];
