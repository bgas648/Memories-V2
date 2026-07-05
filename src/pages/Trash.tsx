import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, RotateCcw, Play } from 'lucide-react';
import { useGalleryStore } from '../store/galleryStore';
import { useToastStore } from '../store/toastStore';
import EmptyState from '../components/ui/EmptyState';
import { PhotoGridSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import ConfirmModal from '../components/ui/ConfirmModal';
import { daysUntilPurge } from '../utils/format';
import type { Photo } from '../types';

export default function Trash() {
  const allPhotos = useGalleryStore((s) => s.photos);
  const loading = useGalleryStore((s) => s.loading);
  const loaded = useGalleryStore((s) => s.loaded);
  const restore = useGalleryStore((s) => s.restore);
  const purge = useGalleryStore((s) => s.purge);
  const push = useToastStore((s) => s.push);
  const photos = allPhotos.filter((p) => p.is_deleted).sort((a, b) => +new Date(b.deleted_at || 0) - +new Date(a.deleted_at || 0));
  const [purging, setPurging] = useState<Photo | null>(null);
  const [emptyAll, setEmptyAll] = useState(false);

  const handleRestore = (p: Photo) => { restore(p.id); push('Photo restored'); };
  const handlePurge = () => { if (purging) { purge(purging.id); push('Permanently deleted'); setPurging(null); } };
  const handleEmptyAll = async () => { for (const p of photos) await purge(p.id); push('Recently Deleted emptied'); setEmptyAll(false); };

  return (
    <div>
      <PageHeader
        title="Recently Deleted"
        subtitle="Items are removed after 30 days"
        action={photos.length > 0 ? <button onClick={() => setEmptyAll(true)} className="h-11 px-4 rounded-full bg-red-500/10 text-red-500 text-sm font-medium hover:bg-red-500/20 transition">Empty All</button> : undefined}
      />

      {loading && !loaded ? (
        <PhotoGridSkeleton />
      ) : photos.length === 0 ? (
        <EmptyState icon={Trash2} title="Nothing here" description="Deleted photos and videos appear here for 30 days before being permanently removed." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((p, i) => (
            <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: Math.min(i * 0.03, 0.3) }}
              className="relative rounded-2xl overflow-hidden aspect-square bg-neutral-200 dark:bg-neutral-800 group">
              {p.type === 'video' ? (
                <>
                  <video src={p.url} className="w-full h-full object-cover opacity-70" muted />
                  <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/40 backdrop-blur flex items-center justify-center"><Play size={11} className="text-white ml-0.5" fill="white" /></div>
                </>
              ) : (
                <img src={p.thumb_url || p.url} className="w-full h-full object-cover opacity-70" loading="lazy" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 text-[11px] text-white font-medium">{daysUntilPurge(p.deleted_at)}d left</div>
              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition bg-black/30">
                <button onClick={() => handleRestore(p)} title="Restore" className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-brand"><RotateCcw size={18} /></button>
                <button onClick={() => setPurging(p)} title="Delete permanently" className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white"><Trash2 size={18} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmModal open={!!purging} title="Delete Permanently?" message="This item will be permanently deleted and cannot be recovered." confirmLabel="Delete" danger onConfirm={handlePurge} onClose={() => setPurging(null)} />
      <ConfirmModal open={emptyAll} title="Empty Recently Deleted?" message={`All ${photos.length} items will be permanently deleted. This cannot be undone.`} confirmLabel="Empty All" danger onConfirm={handleEmptyAll} onClose={() => setEmptyAll(false)} />
    </div>
  );
}
