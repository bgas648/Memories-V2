import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Check, Play } from 'lucide-react';
import type { Photo } from '../../types';

interface Props {
  photo: Photo;
  index: number;
  selectMode: boolean;
  selected: boolean;
  onClick: () => void;
  onToggleSelect: () => void;
  onFavorite: () => void;
}

function PhotoCardBase({ photo, index, selectMode, selected, onClick, onToggleSelect, onFavorite }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.015, 0.4) }}
      className="relative mb-3 break-inside-avoid group cursor-pointer"
      onClick={selectMode ? onToggleSelect : onClick}
    >
      <div className={`relative rounded-2xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 transition-all ${selected ? 'ring-[3px] ring-brand ring-offset-2 ring-offset-canvas dark:ring-offset-canvas-dark' : ''}`}>
        {!loaded && <div className="skeleton absolute inset-0" />}
        {photo.type === 'video' ? (
          <video
            src={photo.url}
            className="w-full block"
            muted
            playsInline
            preload="metadata"
            onLoadedData={() => setLoaded(true)}
          />
        ) : (
          <img
            src={photo.thumb_url || photo.url}
            alt={photo.filename}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`w-full block transition-all duration-500 group-hover:scale-[1.03] ${loaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {photo.type === 'video' && (
          <div className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full bg-black/40 backdrop-blur flex items-center justify-center">
            <Play size={13} className="text-white ml-0.5" fill="white" />
          </div>
        )}

        {/* hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition" />

        {/* favorite */}
        {!selectMode && (
          <button
            onClick={(e) => { e.stopPropagation(); onFavorite(); }}
            className={`absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition ${
              photo.is_favorite ? 'bg-white/90 opacity-100' : 'bg-black/30 backdrop-blur opacity-0 group-hover:opacity-100'
            }`}
          >
            <Heart size={16} className={photo.is_favorite ? 'text-[#FF2D55]' : 'text-white'} fill={photo.is_favorite ? '#FF2D55' : 'none'} />
          </button>
        )}

        {/* select circle */}
        {selectMode && (
          <div className={`absolute top-2.5 right-2.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
            selected ? 'bg-brand border-brand' : 'border-white bg-black/20 backdrop-blur'
          }`}>
            {selected && <Check size={14} className="text-white" strokeWidth={3} />}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default memo(PhotoCardBase);
