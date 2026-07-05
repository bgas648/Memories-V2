import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Aperture } from 'lucide-react';
import { mainNav, sideExtra } from './navItems';
import { useAuthStore } from '../../store/authStore';
import { useGalleryStore } from '../../store/galleryStore';
import { formatBytes } from '../../utils/format';

const STORAGE_LIMIT = 5 * 1024 * 1024 * 1024; // 5GB

export default function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const photos = useGalleryStore((s) => s.photos);
  const used = photos.filter((p) => !p.is_deleted).reduce((a, p) => a + (p.size || 0), 0);
  const pct = Math.min(100, (used / STORAGE_LIMIT) * 100);

  const link = (isActive: boolean) =>
    `relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[15px] font-medium transition-colors ${
      isActive
        ? 'text-brand'
        : 'text-neutral-600 dark:text-neutral-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
    }`;

  return (
    <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 w-64 glass border-r border-black/[0.06] dark:border-white/[0.06] z-40">
      <div className="flex items-center gap-2.5 px-6 h-20">
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-brand to-[#5AC8FA] flex items-center justify-center shadow-lg shadow-brand/25">
          <Aperture size={20} className="text-white" />
        </div>
        <span className="text-[19px] font-semibold tracking-tight">Memories</span>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {mainNav.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => link(isActive)}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="side-active"
                    className="absolute inset-0 rounded-xl bg-brand/10"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
                <item.icon size={20} className="relative z-10" strokeWidth={2} />
                <span className="relative z-10">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
        <div className="h-px bg-black/[0.06] dark:bg-white/[0.06] my-3 mx-2" />
        {sideExtra.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => link(isActive)}>
            <item.icon size={20} strokeWidth={2} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs font-medium mb-2">
            <span className="text-neutral-500 dark:text-neutral-400">Storage</span>
            <span className="text-neutral-700 dark:text-neutral-200">{formatBytes(used)}</span>
          </div>
          <div className="h-1.5 rounded-full bg-black/[0.08] dark:bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-brand to-[#5AC8FA]" style={{ width: `${pct}%` }} />
          </div>
          <div className="text-[11px] text-neutral-400 mt-2">{formatBytes(STORAGE_LIMIT - used)} available</div>
        </div>
        {user && (
          <div className="flex items-center gap-2.5 px-1 mt-4">
            <img
              src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || 'U')}&background=007AFF&color=fff`}
              alt=""
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="min-w-0">
              <div className="text-[13px] font-medium truncate">{user.user_metadata?.full_name || 'You'}</div>
              <div className="text-[11px] text-neutral-400 truncate">{user.email}</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
