import { useState } from 'react';
import { LayoutGrid, Plus } from 'lucide-react';
import { useGalleryStore } from '../store/galleryStore';
import { useToastStore } from '../store/toastStore';
import * as api from '../services/api';
import type { Album } from '../types';
import AlbumCard from '../components/albums/AlbumCard';
import EmptyState from '../components/ui/EmptyState';
import { AlbumGridSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import PromptModal from '../components/ui/PromptModal';
import ConfirmModal from '../components/ui/ConfirmModal';

export default function Albums() {
  const albums = useGalleryStore((s) => s.albums);
  const loading = useGalleryStore((s) => s.loading);
  const loaded = useGalleryStore((s) => s.loaded);
  const refreshAlbums = useGalleryStore((s) => s.refreshAlbums);
  const push = useToastStore((s) => s.push);

  const [createOpen, setCreateOpen] = useState(false);
  const [renaming, setRenaming] = useState<Album | null>(null);
  const [deleting, setDeleting] = useState<Album | null>(null);

  const create = async (name: string) => {
    await api.createAlbum(name);
    await refreshAlbums();
    push('Album created');
    setCreateOpen(false);
  };
  const rename = async (name: string) => {
    if (!renaming) return;
    await api.updateAlbum(renaming.id, { name });
    await refreshAlbums();
    push('Album renamed');
    setRenaming(null);
  };
  const remove = async () => {
    if (!deleting) return;
    await api.deleteAlbum(deleting.id);
    await refreshAlbums();
    push('Album deleted');
    setDeleting(null);
  };

  return (
    <div>
      <PageHeader
        title="Albums"
        subtitle={loaded ? `${albums.length} ${albums.length === 1 ? 'album' : 'albums'}` : 'Loading albums'}
        action={<button onClick={() => setCreateOpen(true)} className="h-11 px-4 rounded-full bg-brand text-white text-sm font-medium flex items-center gap-1.5 hover:opacity-90 transition shadow-lg shadow-brand/25"><Plus size={18} /> <span className="hidden sm:inline">New Album</span></button>}
      />

      {loading && !loaded ? (
        <AlbumGridSkeleton />
      ) : albums.length === 0 ? (
        <EmptyState icon={LayoutGrid} title="No albums yet" description="Create albums to organize your memories into beautiful collections."
          action={<button onClick={() => setCreateOpen(true)} className="px-5 py-2.5 rounded-full bg-brand text-white text-sm font-medium hover:opacity-90 transition">Create album</button>} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {albums.map((a, i) => (
            <AlbumCard key={a.id} album={a} index={i} onRename={() => setRenaming(a)} onDelete={() => setDeleting(a)} />
          ))}
        </div>
      )}

      <PromptModal open={createOpen} title="New Album" placeholder="Album name" confirmLabel="Create" onConfirm={create} onClose={() => setCreateOpen(false)} />
      <PromptModal open={!!renaming} title="Rename Album" placeholder="Album name" initialValue={renaming?.name} onConfirm={rename} onClose={() => setRenaming(null)} />
      <ConfirmModal open={!!deleting} title="Delete Album?" message={`"${deleting?.name}" will be deleted. Your photos will stay in your gallery.`} confirmLabel="Delete" danger onConfirm={remove} onClose={() => setDeleting(null)} />
    </div>
  );
}
