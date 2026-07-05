import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-20 px-6"
    >
      <div className="w-20 h-20 rounded-3xl glass flex items-center justify-center mb-5 shadow-sm">
        <Icon size={34} className="text-brand" strokeWidth={1.6} />
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{title}</h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5 max-w-xs">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
