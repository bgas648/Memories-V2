import { useState } from 'react';
import { Images } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGalleryStore } from '../store/galleryStore';
import { useFilteredPhotos } from '../hooks/useFilteredPhotos';
import type { Photo } from '../types';
import GalleryToolbar from '../components/photos/GalleryToolbar';
import SelectionBar from '../components/photos/SelectionBar';
import PhotoGrid from '../components/photos/PhotoGrid';
import PhotoViewer from '../components/photos/PhotoViewer';
import AddToAlbumModal from '../components/albums/AddToAlbumModal';
import EmptyState from '../components/ui/EmptyState';
import { PhotoGridSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';

export default function Gallery() {
  const loading = useGalleryStore((s) => s.loading);
  const loaded = useGalleryStore((s) => s.loaded);
  const selected = useGalleryStore((s) => s.selected);
  const navigate = useNavigate();
  const photos = useFilteredPhotos();
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [albumModal, setAlbumModal] = useState(false);

  const open = (photo: Photo) => setViewerIndex(photos.findIndex((p) => p.id === photo.id));

  return (
    <div>
      <PageHeader title="Gallery" subtitle={loaded ? `${photos.length} ${photos.length === 1 ? 'memory' : 'memories'}` : 'Loading your memories'} />
      <SelectionBar allIds={photos.map((p) => p.id)} onAddToAlbum={() => setAlbumModal(true)} />
      <GalleryToolbar />

      {loading && !loaded ? (
        <PhotoGridSkeleton />
      ) : photos.length === 0 ? (
        <EmptyState
          icon={Images}
          title="No memories yet"
          description="Upload your first photos and videos to start building your beautiful gallery."
          action={<button onClick={() => navigate('/upload')} className="px-5 py-2.5 rounded-full bg-brand text-white text-sm font-medium hover:opacity-90 transition">Upload photos</button>}
        />
      ) : (
        <PhotoGrid photos={photos} onOpen={open} />
      )}

      {viewerIndex !== null && (
        <PhotoViewer photos={photos} index={viewerIndex} onClose={() => setViewerIndex(null)} onIndexChange={setViewerIndex} />
      )}
      <AddToAlbumModal open={albumModal} onClose={() => setAlbumModal(false)} photoIds={Array.from(selected)} />
    </div>
  );
}
