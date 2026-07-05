import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Download, Trash2, Share2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import type { Photo } from '../../types';
import { useGalleryStore } from '../../store/galleryStore';
import { useToastStore } from '../../store/toastStore';
import { formatDate, formatBytes } from '../../utils/format';

interface Props {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}

export default function PhotoViewer({ photos, index, onClose, onIndexChange }: Props) {
  const [zoom, setZoom] = useState(1);
  const toggleFavorite = useGalleryStore((s) => s.toggleFavorite);
  const softDelete = useGalleryStore((s) => s.softDelete);
  const push = useToastStore((s) => s.push);
  const photo = photos[index];

  const next = useCallback(() => {
    if (index < photos.length - 1) { onIndexChange(index + 1); setZoom(1); }
  }, [index, photos.length, onIndexChange]);
  const prev = useCallback(() => {
    if (index > 0) { onIndexChange(index - 1); setZoom(1); }
  }, [index, onIndexChange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [next, prev, onClose]);

  if (!photo) return null;

  const download = async () => {
    try {
      const res = await fetch(photo.url);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = photo.filename;
      a.click();
      URL.revokeObjectURL(url);
      push('Download started');
    } catch {
      window.open(photo.url, '_blank');
    }
  };

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: photo.filename, url: photo.url });
      } else {
        await navigator.clipboard.writeText(photo.url);
        push('Link copied to clipboard');
      }
    } catch { /* cancelled */ }
  };

  const handleDelete = () => {
    softDelete(photo.id);
    push('Moved to Recently Deleted');
    if (photos.length === 1) onClose();
    else if (index === photos.length - 1) prev();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-2xl flex flex-col"
      >
        {/* top bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 h-16 shrink-0 z-10">
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition">
            <X size={20} />
          </button>
          <div className="text-white/70 text-sm text-center min-w-0 px-4">
            <div className="truncate font-medium text-white">{photo.filename}</div>
            <div className="text-xs">{formatDate(photo.created_at)} · {formatBytes(photo.size)}</div>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setZoom((z) => Math.max(1, z - 0.5))} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"><ZoomOut size={18} /></button>
            <button onClick={() => setZoom((z) => Math.min(4, z + 0.5))} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"><ZoomIn size={18} /></button>
          </div>
        </div>

        {/* media */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden select-none">
          {index > 0 && (
            <button onClick={prev} className="hidden sm:flex absolute left-4 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center text-white transition"><ChevronLeft size={24} /></button>
          )}
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            drag={zoom === 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, info) => {
              if (info.offset.x < -100) next();
              else if (info.offset.x > 100) prev();
            }}
            className="max-w-[92vw] max-h-[76vh] flex items-center justify-center"
          >
            {photo.type === 'video' ? (
              <video src={photo.url} controls autoPlay className="max-w-[92vw] max-h-[76vh] rounded-xl" />
            ) : (
              <img
                src={photo.url}
                alt={photo.filename}
                style={{ transform: `scale(${zoom})` }}
                className="max-w-[92vw] max-h-[76vh] object-contain rounded-xl transition-transform duration-200"
                draggable={false}
              />
            )}
          </motion.div>
          {index < photos.length - 1 && (
            <button onClick={next} className="hidden sm:flex absolute right-4 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center text-white transition"><ChevronRight size={24} /></button>
          )}
        </div>

        {/* action bar */}
        <div className="shrink-0 pb-8 pt-4 flex justify-center">
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 backdrop-blur-xl">
            <ActionBtn icon={Heart} active={photo.is_favorite} activeColor="#FF2D55" label="Favorite" onClick={() => toggleFavorite(photo.id)} />
            <ActionBtn icon={Download} label="Download" onClick={download} />
            <ActionBtn icon={Share2} label="Share" onClick={share} />
            <ActionBtn icon={Trash2} label="Delete" danger onClick={handleDelete} />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ActionBtn({ icon: Icon, label, onClick, active, activeColor, danger }: {
  icon: typeof Heart; label: string; onClick: () => void; active?: boolean; activeColor?: string; danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-full transition hover:bg-white/10 ${danger ? 'text-red-400' : 'text-white'}`}
    >
      <Icon size={20} fill={active ? activeColor : 'none'} color={active ? activeColor : undefined} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
