import { motion, AnimatePresence } from 'framer-motion';
import { X, FolderPlus, Check } from 'lucide-react';
import { useState } from 'react';
import { useGalleryStore } from '../../store/galleryStore';
import { useToastStore } from '../../store/toastStore';
import * as api from '../../services/api';

interface Props {
  open: boolean;
  onClose: () => void;
  photoIds: string[];
}

export default function AddToAlbumModal({ open, onClose, photoIds }: Props) {
  const albums = useGalleryStore((s) => s.albums);
  const setAlbumForPhoto = useGalleryStore((s) => s.setAlbumForPhoto);
  const refreshAlbums = useGalleryStore((s) => s.refreshAlbums);
  const clearSelect = useGalleryStore((s) => s.clearSelect);
  const push = useToastStore((s) => s.push);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  const assign = async (albumId: string, albumName: string) => {
    setBusy(true);
    for (const id of photoIds) await setAlbumForPhoto(id, albumId);
    push(`Added to ${albumName}`);
    setBusy(false);
    clearSelect();
    onClose();
  };

  const createAndAssign = async () => {
    if (!name.trim()) return;
    setBusy(true);
    const album = await api.createAlbum(name.trim());
    await refreshAlbums();
    for (const id of photoIds) await setAlbumForPhoto(id, album.id);
    push(`Added to ${album.name}`);
    setBusy(false);
    setName('');
    setCreating(false);
    clearSelect();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[95] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong rounded-[28px] w-full max-w-md p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-semibold">Add to Album</h3>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/[0.05] dark:bg-white/10 flex items-center justify-center"><X size={17} /></button>
            </div>

            {creating ? (
              <div className="space-y-3">
                <input autoFocus value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && createAndAssign()}
                  placeholder="Album name" className="w-full h-12 px-4 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] outline-none focus:ring-2 focus:ring-brand/40" />
                <div className="flex gap-2">
                  <button onClick={() => setCreating(false)} className="flex-1 h-11 rounded-2xl bg-black/[0.05] dark:bg-white/10 font-medium">Cancel</button>
                  <button onClick={createAndAssign} disabled={busy || !name.trim()} className="flex-1 h-11 rounded-2xl bg-brand text-white font-medium disabled:opacity-50">Create & Add</button>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[50vh] overflow-y-auto">
                <button onClick={() => setCreating(true)} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition">
                  <div className="w-11 h-11 rounded-xl bg-brand/10 flex items-center justify-center"><FolderPlus size={20} className="text-brand" /></div>
                  <span className="font-medium text-brand">New Album</span>
                </button>
                {albums.map((a) => (
                  <button key={a.id} onClick={() => assign(a.id, a.name)} disabled={busy} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition disabled:opacity-50">
                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                      {a.cover_url ? <img src={a.cover_url} className="w-full h-full object-cover" /> : <Check size={0} />}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{a.name}</div>
                      <div className="text-xs text-neutral-400">{a.photo_count} items</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
