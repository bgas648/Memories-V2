import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ImageOff } from 'lucide-react';
import { useGalleryStore } from '../store/galleryStore';
import { useFilteredPhotos } from '../hooks/useFilteredPhotos';
import type { Photo } from '../types';
import PhotoGrid from '../components/photos/PhotoGrid';
import PhotoViewer from '../components/photos/PhotoViewer';
import EmptyState from '../components/ui/EmptyState';
import { PhotoGridSkeleton } from '../components/ui/Skeleton';

export default function AlbumDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const albums = useGalleryStore((s) => s.albums);
  const allPhotos = useGalleryStore((s) => s.photos);
  const loading = useGalleryStore((s) => s.loading);
  const loaded = useGalleryStore((s) => s.loaded);
  const album = albums.find((a) => a.id === id);

  const albumPhotos = allPhotos.filter((p) => p.album_id === id);
  const photos = useFilteredPhotos(albumPhotos);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const open = (photo: Photo) => setViewerIndex(photos.findIndex((p) => p.id === photo.id));

  return (
    <div>
      <button onClick={() => navigate('/albums')} className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-brand transition mb-4">
        <ArrowLeft size={17} /> Albums
      </button>
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">{album?.name || 'Album'}</h1>
        <p className="text-[15px] text-neutral-500 dark:text-neutral-400 mt-1">{photos.length} {photos.length === 1 ? 'item' : 'items'}</p>
      </div>

      {loading && !loaded ? (
        <PhotoGridSkeleton />
      ) : photos.length === 0 ? (
        <EmptyState icon={ImageOff} title="This album is empty" description="Add photos to this album from your gallery by selecting them and choosing Add to Album." />
      ) : (
        <PhotoGrid photos={photos} onOpen={open} />
      )}

      {viewerIndex !== null && (
        <PhotoViewer photos={photos} index={viewerIndex} onClose={() => setViewerIndex(null)} onIndexChange={setViewerIndex} />
      )}
    </div>
  );
}
