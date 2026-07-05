import { useGalleryStore } from '../../store/galleryStore';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import type { Photo } from '../../types';
import PhotoCard from './PhotoCard';
import Spinner from '../ui/Spinner';

interface Props {
  photos: Photo[];
  onOpen: (photo: Photo) => void;
}

export default function PhotoGrid({ photos, onOpen }: Props) {
  const { visible, sentinel, hasMore } = useInfiniteScroll(photos, 24);
  const selectMode = useGalleryStore((s) => s.selectMode);
  const selected = useGalleryStore((s) => s.selected);
  const toggleSelect = useGalleryStore((s) => s.toggleSelect);
  const toggleFavorite = useGalleryStore((s) => s.toggleFavorite);

  return (
    <div>
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 [column-fill:_balance]">
        {visible.map((photo, i) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            index={i}
            selectMode={selectMode}
            selected={selected.has(photo.id)}
            onClick={() => onOpen(photo)}
            onToggleSelect={() => toggleSelect(photo.id)}
            onFavorite={() => toggleFavorite(photo.id)}
          />
        ))}
      </div>
      {hasMore && (
        <div ref={sentinel} className="flex justify-center py-8">
          <Spinner size={22} className="text-brand" />
        </div>
      )}
    </div>
  );
}
