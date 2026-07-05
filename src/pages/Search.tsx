import { useState, useEffect } from 'react';
import { Search as SearchIcon, Sparkles } from 'lucide-react';
import { useGalleryStore } from '../store/galleryStore';
import { useFilteredPhotos } from '../hooks/useFilteredPhotos';
import type { Photo } from '../types';
import PhotoGrid from '../components/photos/PhotoGrid';
import PhotoViewer from '../components/photos/PhotoViewer';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';

export default function Search() {
  const search = useGalleryStore((s) => s.search);
  const setSearch = useGalleryStore((s) => s.setSearch);
  const albums = useGalleryStore((s) => s.albums);
  const photos = useFilteredPhotos();
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  useEffect(() => () => setSearch(''), [setSearch]);

  const open = (photo: Photo) => setViewerIndex(photos.findIndex((p) => p.id === photo.id));
  const suggestions = ['Today', 'This Month', ...albums.slice(0, 3).map((a) => a.name)];

  return (
    <div>
      <PageHeader title="Search" />
      <div className="relative mb-5">
        <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, album, or date"
          className="w-full h-13 py-3.5 pl-12 pr-4 rounded-2xl glass text-[16px] outline-none focus:ring-2 focus:ring-brand/40 transition placeholder:text-neutral-400"
        />
      </div>

      {!search.trim() ? (
        <div>
          <div className="flex flex-wrap gap-2 mb-8">
            {suggestions.map((s) => (
              <button key={s} onClick={() => setSearch(s)} className="px-4 py-2 rounded-full glass text-sm font-medium hover:bg-white/90 dark:hover:bg-white/10 transition">{s}</button>
            ))}
          </div>
          <EmptyState icon={Sparkles} title="Search your memories" description="Start typing to instantly find photos by filename, album, or the date they were captured." />
        </div>
      ) : photos.length === 0 ? (
        <EmptyState icon={SearchIcon} title="No results" description={`Nothing matched “${search}”. Try a different search.`} />
      ) : (
        <>
          <p className="text-sm text-neutral-400 mb-4">{photos.length} {photos.length === 1 ? 'result' : 'results'}</p>
          <PhotoGrid photos={photos} onOpen={open} />
        </>
      )}

      {viewerIndex !== null && (
        <PhotoViewer photos={photos} index={viewerIndex} onClose={() => setViewerIndex(null)} onIndexChange={setViewerIndex} />
      )}
    </div>
  );
}
