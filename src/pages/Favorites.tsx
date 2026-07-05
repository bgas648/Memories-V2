import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useGalleryStore } from '../store/galleryStore';
import type { Photo } from '../types';
import PhotoGrid from '../components/photos/PhotoGrid';
import PhotoViewer from '../components/photos/PhotoViewer';
import EmptyState from '../components/ui/EmptyState';
import { PhotoGridSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';

export default function Favorites() {
  const allPhotos = useGalleryStore((s) => s.photos);
  const loading = useGalleryStore((s) => s.loading);
  const loaded = useGalleryStore((s) => s.loaded);
  const photos = allPhotos
    .filter((p) => !p.is_deleted && p.is_favorite)
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const open = (photo: Photo) => setViewerIndex(photos.findIndex((p) => p.id === photo.id));

  return (
    <div>
      <PageHeader title="Favorites" subtitle={`${photos.length} ${photos.length === 1 ? 'favorite' : 'favorites'}`} />
      {loading && !loaded ? (
        <PhotoGridSkeleton />
      ) : photos.length === 0 ? (
        <EmptyState icon={Heart} title="No favorites yet" description="Tap the heart on any photo to keep your most-loved memories here." />
      ) : (
        <PhotoGrid photos={photos} onOpen={open} />
      )}
      {viewerIndex !== null && (
        <PhotoViewer photos={photos} index={viewerIndex} onClose={() => setViewerIndex(null)} onIndexChange={setViewerIndex} />
      )}
    </div>
  );
}
