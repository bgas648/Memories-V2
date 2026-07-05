import { useMemo } from 'react';
import type { Photo } from '../types';
import { useGalleryStore } from '../store/galleryStore';

export function useFilteredPhotos(source?: Photo[]) {
  const photos = useGalleryStore((s) => s.photos);
  const search = useGalleryStore((s) => s.search);
  const sort = useGalleryStore((s) => s.sort);
  const filter = useGalleryStore((s) => s.filter);
  const albums = useGalleryStore((s) => s.albums);

  return useMemo(() => {
    let list = (source ?? photos).filter((p) => !p.is_deleted);

    if (filter === 'image') list = list.filter((p) => p.type === 'image');
    else if (filter === 'video') list = list.filter((p) => p.type === 'video');
    else if (filter === 'favorite') list = list.filter((p) => p.is_favorite);

    if (search.trim()) {
      const q = search.toLowerCase();
      const albumNames = new Map(albums.map((a) => [a.id, a.name.toLowerCase()]));
      list = list.filter((p) => {
        const albumName = p.album_id ? albumNames.get(p.album_id) || '' : '';
        const dateStr = new Date(p.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toLowerCase();
        return p.filename.toLowerCase().includes(q) || albumName.includes(q) || dateStr.includes(q);
      });
    }

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'oldest': return +new Date(a.created_at) - +new Date(b.created_at);
        case 'name': return a.filename.localeCompare(b.filename);
        case 'size': return b.size - a.size;
        default: return +new Date(b.created_at) - +new Date(a.created_at);
      }
    });
    return list;
  }, [photos, source, search, sort, filter, albums]);
}
