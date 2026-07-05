import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Props {
  open: boolean;
  title: string;
  placeholder?: string;
  initialValue?: string;
  confirmLabel?: string;
  onConfirm: (value: string) => void;
  onClose: () => void;
}

export default function PromptModal({ open, title, placeholder, initialValue = '', confirmLabel = 'Save', onConfirm, onClose }: Props) {
  const [value, setValue] = useState(initialValue);
  useEffect(() => { if (open) setValue(initialValue); }, [open, initialValue]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
          className="fixed inset-0 z-[95] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <motion.div initial={{ y: 40, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0 }}
            onClick={(e) => e.stopPropagation()} className="glass-strong rounded-[28px] w-full max-w-sm p-6 shadow-2xl">
            <h3 className="text-xl font-semibold mb-4">{title}</h3>
            <input autoFocus value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && value.trim() && onConfirm(value.trim())}
              placeholder={placeholder} className="w-full h-12 px-4 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] outline-none focus:ring-2 focus:ring-brand/40" />
            <div className="flex gap-2 mt-4">
              <button onClick={onClose} className="flex-1 h-11 rounded-2xl bg-black/[0.05] dark:bg-white/10 font-medium">Cancel</button>
              <button onClick={() => value.trim() && onConfirm(value.trim())} disabled={!value.trim()} className="flex-1 h-11 rounded-2xl bg-brand text-white font-medium disabled:opacity-50">{confirmLabel}</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
