import { useState, useRef, useEffect } from 'react';
import { Search, ArrowUpDown, SlidersHorizontal, CheckSquare, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGalleryStore } from '../../store/galleryStore';
import type { SortOption, FilterOption } from '../../types';

const sorts: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'name', label: 'Name' },
  { value: 'size', label: 'Size' },
];
const filters: { value: FilterOption; label: string }[] = [
  { value: 'all', label: 'All items' },
  { value: 'image', label: 'Photos' },
  { value: 'video', label: 'Videos' },
  { value: 'favorite', label: 'Favorites' },
];

export default function GalleryToolbar() {
  const search = useGalleryStore((s) => s.search);
  const setSearch = useGalleryStore((s) => s.setSearch);
  const sort = useGalleryStore((s) => s.sort);
  const setSort = useGalleryStore((s) => s.setSort);
  const filter = useGalleryStore((s) => s.filter);
  const setFilter = useGalleryStore((s) => s.setFilter);
  const selectMode = useGalleryStore((s) => s.selectMode);
  const setSelectMode = useGalleryStore((s) => s.setSelectMode);

  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="relative flex-1">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your memories"
          className="w-full h-11 pl-11 pr-4 rounded-full glass text-[15px] outline-none focus:ring-2 focus:ring-brand/40 transition placeholder:text-neutral-400"
        />
      </div>
      <Dropdown icon={ArrowUpDown} label="Sort">
        {sorts.map((s) => (
          <MenuItem key={s.value} active={sort === s.value} onClick={() => setSort(s.value)}>{s.label}</MenuItem>
        ))}
      </Dropdown>
      <Dropdown icon={SlidersHorizontal} label="Filter">
        {filters.map((f) => (
          <MenuItem key={f.value} active={filter === f.value} onClick={() => setFilter(f.value)}>{f.label}</MenuItem>
        ))}
      </Dropdown>
      <button
        onClick={() => setSelectMode(!selectMode)}
        className={`h-11 px-4 rounded-full flex items-center gap-2 text-sm font-medium transition ${selectMode ? 'bg-brand text-white' : 'glass hover:bg-white/90 dark:hover:bg-white/10'}`}
      >
        <CheckSquare size={17} />
        <span className="hidden sm:inline">Select</span>
      </button>
    </div>
  );
}

function Dropdown({ icon: Icon, label, children }: { icon: typeof Search; label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="h-11 px-4 rounded-full glass flex items-center gap-2 text-sm font-medium hover:bg-white/90 dark:hover:bg-white/10 transition">
        <Icon size={17} />
        <span className="hidden sm:inline">{label}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpen(false)}
            className="absolute right-0 mt-2 w-48 glass-strong rounded-2xl shadow-xl p-1.5 z-40"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[14px] font-medium hover:bg-black/[0.05] dark:hover:bg-white/10 transition">
      {children}
      {active && <Check size={16} className="text-brand" />}
    </button>
  );
}
