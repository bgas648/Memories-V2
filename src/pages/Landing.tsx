import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Aperture, Images, LayoutGrid, Heart, Search, Cloud, Shield, Sparkles, ChevronRight, ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import ThemeToggle from '../components/ui/ThemeToggle';
import FAQ from '../components/landing/FAQ';

const features = [
  { icon: Images, title: 'Beautiful Gallery', desc: 'A fluid masonry layout that adapts to every photo. Lazy loaded and buttery smooth.' },
  { icon: LayoutGrid, title: 'Smart Albums', desc: 'Organize memories into albums with covers, drag & drop, and instant search.' },
  { icon: Cloud, title: 'Cloud Sync', desc: 'Everything is safely stored in the cloud and available on all your devices.' },
  { icon: Heart, title: 'Favorites', desc: 'Mark the moments that matter and find them in one tap, anytime.' },
  { icon: Shield, title: 'Recently Deleted', desc: 'Deleted by mistake? Restore photos for up to 30 days before they vanish.' },
  { icon: Search, title: 'Instant Search', desc: 'Find any photo by name, album, or date the moment you start typing.' },
];

export default function Landing() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/gallery', { replace: true });
  }, [user, navigate]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-brand to-[#5AC8FA] flex items-center justify-center shadow-lg shadow-brand/25">
              <Aperture size={20} className="text-white" />
            </div>
            <span className="text-[19px] font-semibold tracking-tight">Memories</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/login"
              className="px-4 sm:px-5 py-2 rounded-full bg-brand text-white text-sm font-medium hover:opacity-90 transition shadow-lg shadow-brand/25"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-40 pb-28 px-5">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-brand/20 blur-[140px] animate-float-slow" />
          <div className="absolute top-40 right-0 w-[500px] h-[500px] rounded-full bg-[#5AC8FA]/20 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#FF2D55]/10 blur-[120px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-medium mb-8"
          >
            <Sparkles size={15} className="text-brand" />
            Your memories, beautifully organized
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-5xl sm:text-7xl font-semibold tracking-tight leading-[1.05] text-balance"
          >
            Every moment,
            <br />
            <span className="bg-gradient-to-r from-brand to-[#5AC8FA] bg-clip-text text-transparent">perfectly kept.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-lg sm:text-xl text-neutral-500 dark:text-neutral-400 mt-6 max-w-2xl mx-auto text-balance"
          >
            A premium cloud photo gallery designed with the elegance of Apple Photos. Upload, organize, and relive your favorite memories anywhere.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="flex items-center justify-center gap-3 mt-10"
          >
            <Link
              to="/login"
              className="group px-6 py-3.5 rounded-full bg-brand text-white text-[15px] font-semibold hover:opacity-90 transition shadow-xl shadow-brand/30 flex items-center gap-2"
            >
              Get started free
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition" />
            </Link>
            <a href="#features" className="px-6 py-3.5 rounded-full glass text-[15px] font-semibold hover:bg-white/90 dark:hover:bg-white/10 transition">
              Learn more
            </a>
          </motion.div>
        </div>

        {/* Hero mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="max-w-5xl mx-auto mt-20"
        >
          <div className="glass rounded-[28px] p-3 shadow-2xl shadow-black/20">
            <div className="rounded-[20px] overflow-hidden bg-neutral-100 dark:bg-neutral-900">
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 p-1.5">
                {HERO_IMAGES.map((src, i) => (
                  <motion.img
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.04 }}
                    src={src}
                    className={`w-full object-cover rounded-lg ${i % 5 === 0 ? 'row-span-2 aspect-[3/4]' : 'aspect-square'}`}
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-balance">Designed for your moments</h2>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 mt-4 max-w-xl mx-auto">
              Every detail crafted to make browsing your memories feel effortless and delightful.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="glass rounded-3xl p-7 hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center mb-5">
                  <f.icon size={24} className="text-brand" />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="text-[15px] text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots */}
      <section className="py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">Beautiful on every screen</h2>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 mt-4">Fully responsive, from your phone to your desktop.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {SHOTS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass rounded-3xl overflow-hidden group"
              >
                <img src={s.img} className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                <div className="p-6">
                  <h3 className="font-semibold text-lg">{s.title}</h3>
                  <p className="text-[15px] text-neutral-500 dark:text-neutral-400 mt-1">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FAQ />

      {/* CTA */}
      <section className="py-24 px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass rounded-[32px] p-12 sm:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-brand/20 blur-[100px]" />
          <div className="relative">
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-balance">Start keeping your memories today</h2>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 mt-4 max-w-lg mx-auto">Sign in with Google and your gallery is ready in seconds. No credit card required.</p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 rounded-full bg-brand text-white text-[15px] font-semibold hover:opacity-90 transition shadow-xl shadow-brand/30"
            >
              Get started <ChevronRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/[0.06] dark:border-white/[0.06] py-12 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand to-[#5AC8FA] flex items-center justify-center">
              <Aperture size={17} className="text-white" />
            </div>
            <span className="font-semibold">Memories</span>
          </div>
          <p className="text-sm text-neutral-400">© {new Date().getFullYear()} Memories. Crafted with care.</p>
          <div className="flex gap-6 text-sm text-neutral-500 dark:text-neutral-400">
            <a href="#features" className="hover:text-brand transition">Features</a>
            <Link to="/login" className="hover:text-brand transition">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=70',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=70',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=70',
  'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&q=70',
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&q=70',
  'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&q=70',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=70',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=70',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=70',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=70',
  'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=400&q=70',
];

const SHOTS = [
  { img: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=800&q=70', title: 'Fluid gallery', desc: 'A masonry grid that shows every photo at its best.' },
  { img: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931?w=800&q=70', title: 'Organized albums', desc: 'Group your memories into beautiful collections.' },
];
