import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon, LogOut, HardDrive, User, ChevronRight, Images, Heart, Video } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useGalleryStore } from '../store/galleryStore';
import { useToastStore } from '../store/toastStore';
import PageHeader from '../components/ui/PageHeader';
import { formatBytes } from '../utils/format';

const STORAGE_LIMIT = 5 * 1024 * 1024 * 1024;

export default function Settings() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const photos = useGalleryStore((s) => s.photos);
  const push = useToastStore((s) => s.push);
  const navigate = useNavigate();

  const active = photos.filter((p) => !p.is_deleted);
  const used = active.reduce((a, p) => a + (p.size || 0), 0);
  const pct = Math.min(100, (used / STORAGE_LIMIT) * 100);
  const imgCount = active.filter((p) => p.type === 'image').length;
  const vidCount = active.filter((p) => p.type === 'video').length;
  const favCount = active.filter((p) => p.is_favorite).length;

  const handleLogout = async () => {
    await signOut();
    push('Signed out');
    navigate('/');
  };

  return (
    <div className="max-w-2xl">
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6 mb-4">
        <div className="flex items-center gap-4">
          <img
            src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email || 'U')}&background=007AFF&color=fff&size=128`}
            alt=""
            className="w-16 h-16 rounded-full object-cover ring-2 ring-brand/20"
          />
          <div className="min-w-0">
            <h3 className="text-lg font-semibold truncate">{user?.user_metadata?.full_name || 'Your Account'}</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">{user?.email}</p>
          </div>
        </div>
      </motion.div>

      {/* Storage */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass rounded-3xl p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <HardDrive size={19} className="text-brand" />
          <h3 className="font-semibold">Storage</h3>
        </div>
        <div className="flex items-end justify-between mb-2">
          <span className="text-2xl font-semibold">{formatBytes(used)}</span>
          <span className="text-sm text-neutral-400">of {formatBytes(STORAGE_LIMIT)}</span>
        </div>
        <div className="h-2.5 rounded-full bg-black/[0.08] dark:bg-white/10 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className="h-full rounded-full bg-gradient-to-r from-brand to-[#5AC8FA]" />
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5">
          <Stat icon={Images} label="Photos" value={imgCount} />
          <Stat icon={Video} label="Videos" value={vidCount} />
          <Stat icon={Heart} label="Favorites" value={favCount} />
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-3xl p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <User size={19} className="text-brand" />
          <h3 className="font-semibold">Appearance</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setTheme('light')} className={`flex flex-col items-center gap-2 py-5 rounded-2xl border-2 transition ${theme === 'light' ? 'border-brand bg-brand/5' : 'border-transparent bg-black/[0.03] dark:bg-white/[0.04]'}`}>
            <Sun size={24} className={theme === 'light' ? 'text-brand' : 'text-neutral-400'} />
            <span className={`text-sm font-medium ${theme === 'light' ? 'text-brand' : ''}`}>Light</span>
          </button>
          <button onClick={() => setTheme('dark')} className={`flex flex-col items-center gap-2 py-5 rounded-2xl border-2 transition ${theme === 'dark' ? 'border-brand bg-brand/5' : 'border-transparent bg-black/[0.03] dark:bg-white/[0.04]'}`}>
            <Moon size={24} className={theme === 'dark' ? 'text-brand' : 'text-neutral-400'} />
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-brand' : ''}`}>Dark</span>
          </button>
        </div>
      </motion.div>

      {/* Account */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass rounded-3xl p-2 mb-4">
        <button onClick={handleLogout} className="w-full flex items-center justify-between px-4 py-4 rounded-2xl hover:bg-red-500/5 transition group">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center"><LogOut size={18} className="text-red-500" /></div>
            <span className="font-medium text-red-500">Sign Out</span>
          </div>
          <ChevronRight size={18} className="text-neutral-300 group-hover:text-red-500 transition" />
        </button>
      </motion.div>

      <p className="text-center text-xs text-neutral-400 mt-8">Memories · v2.0 · Crafted with care</p>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Images; label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] p-3.5 text-center">
      <Icon size={18} className="text-brand mx-auto mb-1.5" />
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-[11px] text-neutral-400">{label}</div>
    </div>
  );
}
