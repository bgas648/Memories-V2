import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, Info } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';

const icons = {
  success: <CheckCircle2 size={18} className="text-emerald-500" />,
  error: <XCircle size={18} className="text-red-500" />,
  info: <Info size={18} className="text-brand" />,
};

export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  return (
    <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="glass-strong shadow-xl rounded-2xl px-4 py-3 flex items-center gap-2.5 min-w-[220px] max-w-[90vw] pointer-events-auto"
          >
            {icons[t.type]}
            <span className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
