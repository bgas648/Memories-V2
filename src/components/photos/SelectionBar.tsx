import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Trash2, CheckCheck, FolderInput } from 'lucide-react';
import { useGalleryStore } from '../../store/galleryStore';
import { useToastStore } from '../../store/toastStore';
import * as api from '../../services/api';

interface Props {
  allIds: string[];
  onAddToAlbum?: () => void;
}

export default function SelectionBar({ allIds, onAddToAlbum }: Props) {
  const selectMode = useGalleryStore((s) => s.selectMode);
  const selected = useGalleryStore((s) => s.selected);
  const clearSelect = useGalleryStore((s) => s.clearSelect);
  const selectAll = useGalleryStore((s) => s.selectAll);
  const softDelete = useGalleryStore((s) => s.softDelete);
  const toggleFavorite = useGalleryStore((s) => s.toggleFavorite);
  const photos = useGalleryStore((s) => s.photos);
  const push = useToastStore((s) => s.push);

  if (!selectMode) return null;
  const ids = Array.from(selected);

  const favoriteSelected = async () => {
    for (const id of ids) {
      const p = photos.find((x) => x.id === id);
      if (p && !p.is_favorite) await toggleFavorite(id);
    }
    push(`${ids.length} added to Favorites`);
    clearSelect();
  };

  const deleteSelected = async () => {
    for (const id of ids) await softDelete(id);
    push(`${ids.length} moved to Recently Deleted`);
    clearSelect();
  };

  void api; // keep import for tree-shake awareness

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -60, opacity: 0 }}
        className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 glass-strong border-b border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <button onClick={clearSelect} className="w-9 h-9 rounded-full bg-black/[0.05] dark:bg-white/10 flex items-center justify-center">
            <X size={18} />
          </button>
          <span className="font-semibold">{ids.length} selected</span>
          <button onClick={() => selectAll(allIds)} className="text-sm text-brand font-medium flex items-center gap-1">
            <CheckCheck size={16} /> All
          </button>
        </div>
        <div className="flex items-center gap-1">
          {onAddToAlbum && (
            <IconBtn icon={FolderInput} onClick={onAddToAlbum} disabled={!ids.length} />
          )}
          <IconBtn icon={Heart} onClick={favoriteSelected} disabled={!ids.length} />
          <IconBtn icon={Trash2} onClick={deleteSelected} disabled={!ids.length} danger />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function IconBtn({ icon: Icon, onClick, disabled, danger }: { icon: typeof Heart; onClick: () => void; disabled?: boolean; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition disabled:opacity-30 ${danger ? 'text-red-500 hover:bg-red-500/10' : 'text-brand hover:bg-brand/10'}`}
    >
      <Icon size={20} />
    </button>
  );
}
