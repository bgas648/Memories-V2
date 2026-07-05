import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mainNav } from './navItems';

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass-strong border-t border-black/[0.06] dark:border-white/[0.06] pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-2 h-16">
        {mainNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="relative flex flex-col items-center justify-center gap-1 flex-1 h-full"
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={23}
                  strokeWidth={isActive ? 2.4 : 2}
                  className={isActive ? 'text-brand' : 'text-neutral-400 dark:text-neutral-500'}
                />
                <span className={`text-[10px] font-medium ${isActive ? 'text-brand' : 'text-neutral-400 dark:text-neutral-500'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.span layoutId="bottom-active" className="absolute top-0 w-8 h-0.5 rounded-full bg-brand" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
