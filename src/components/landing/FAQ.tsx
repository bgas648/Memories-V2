import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const faqs = [
  { q: 'Is Memories free to use?', a: 'Yes. You can sign in with Google and start uploading photos immediately, completely free, with generous cloud storage included.' },
  { q: 'How do I sign in?', a: 'Memories uses secure Google authentication. Just tap "Continue with Google" and you\'re in — no passwords to remember.' },
  { q: 'What happens when I delete a photo?', a: 'Deleted photos move to Recently Deleted where they stay for 30 days. You can restore them anytime, or permanently remove them.' },
  { q: 'Can I upload videos too?', a: 'Absolutely. Memories supports both images and videos with live previews and upload progress.' },
  { q: 'Is my data private?', a: 'Your photos are stored securely and are only accessible from your own account. Your memories are yours alone.' },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-24 px-5">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">Questions, answered</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-medium text-[16px]">{f.q}</span>
                <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="shrink-0">
                  <Plus size={20} className="text-brand" />
                </motion.span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="px-6 pb-5 text-[15px] text-neutral-500 dark:text-neutral-400 leading-relaxed">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
