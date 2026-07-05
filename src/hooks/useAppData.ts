import { useEffect } from 'react';
import { useGalleryStore } from '../store/galleryStore';
import { useAuthStore } from '../store/authStore';

export function useAppData() {
  const user = useAuthStore((s) => s.user);
  const loadAll = useGalleryStore((s) => s.loadAll);
  const loaded = useGalleryStore((s) => s.loaded);

  useEffect(() => {
    if (user && !loaded) loadAll();
  }, [user, loaded, loadAll]);
}
