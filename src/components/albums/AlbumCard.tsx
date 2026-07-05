import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Pencil, Trash2, LayoutGrid } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { Album } from '../../types';

interface Props {
  album: Album;
  index: number;
  onRename: () => void;
  onDelete: () => void;
}

export default function AlbumCard({ album, index, onRename, onDelete }: Props) {
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setMenu(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3) }}
      className="group"
    >
      <div onClick={() => navigate(`/albums/${album.id}`)} className="relative rounded-2xl overflow-hidden aspect-square bg-neutral-200 dark:bg-neutral-800 cursor-pointer">
        {album.cover_url ? (
          <img src={album.cover_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><LayoutGrid size={32} className="text-neutral-400" /></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition" />
        <div ref={ref} className="absolute top-2 right-2">
          <button onClick={(e) => { e.stopPropagation(); setMenu(!menu); }} className="w-8 h-8 rounded-full bg-black/30 backdrop-blur flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition">
            <MoreHorizontal size={18} />
          </button>
          {menu && (
            <div onClick={(e) => e.stopPropagation()} className="absolute right-0 mt-1 w-36 glass-strong rounded-xl shadow-xl p-1.5 z-20">
              <button onClick={() => { setMenu(false); onRename(); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-black/[0.05] dark:hover:bg-white/10"><Pencil size={15} /> Rename</button>
              <button onClick={() => { setMenu(false); onDelete(); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10"><Trash2 size={15} /> Delete</button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-2.5 px-1">
        <div className="font-semibold text-[15px] truncate">{album.name}</div>
        <div className="text-[13px] text-neutral-400">{album.photo_count} {album.photo_count === 1 ? 'item' : 'items'}</div>
      </div>
    </motion.div>
  );
}
