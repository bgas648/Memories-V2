import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({ open, title, message, confirmLabel = 'Confirm', danger, onConfirm, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
          className="fixed inset-0 z-[95] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <motion.div initial={{ y: 40, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0 }}
            onClick={(e) => e.stopPropagation()} className="glass-strong rounded-[28px] w-full max-w-sm p-6 text-center shadow-2xl">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-[15px] text-neutral-500 dark:text-neutral-400 mt-2">{message}</p>
            <div className="flex gap-2 mt-6">
              <button onClick={onClose} className="flex-1 h-11 rounded-2xl bg-black/[0.05] dark:bg-white/10 font-medium">Cancel</button>
              <button onClick={onConfirm} className={`flex-1 h-11 rounded-2xl text-white font-medium ${danger ? 'bg-red-500' : 'bg-brand'}`}>{confirmLabel}</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
