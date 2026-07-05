import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';

export default function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const toggle = useThemeStore((s) => s.toggle);
  return (
    <button
      onClick={toggle}
      className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/90 dark:hover:bg-white/10 transition"
      aria-label="Toggle theme"
    >
      <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}>
        {theme === 'light' ? <Moon size={19} /> : <Sun size={19} className="text-amber-400" />}
      </motion.span>
    </button>
  );
}
