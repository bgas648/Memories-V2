import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Aperture, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { signInWithGoogle } from '../lib/googleAuth';
import Spinner from '../components/ui/Spinner';

export default function Login() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (user) navigate('/gallery', { replace: true });
  }, [user, navigate]);

  const handleGoogle = () => {
    setSigningIn(true);
    signInWithGoogle('Memories');
    // reset if popup closed without login
    setTimeout(() => setSigningIn(false), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-brand/20 blur-[130px] animate-float-slow" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#5AC8FA]/20 blur-[110px]" />
      </div>

      <Link to="/" className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-neutral-500 hover:text-brand transition">
        <ArrowLeft size={17} /> Back
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass-strong rounded-[32px] p-10 sm:p-12 w-full max-w-md shadow-2xl shadow-black/10 text-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 }}
          className="w-16 h-16 rounded-3xl bg-gradient-to-br from-brand to-[#5AC8FA] flex items-center justify-center mx-auto shadow-xl shadow-brand/30"
        >
          <Aperture size={32} className="text-white" />
        </motion.div>

        <h1 className="text-3xl font-semibold tracking-tight mt-7">Welcome to Memories</h1>
        <p className="text-[15px] text-neutral-500 dark:text-neutral-400 mt-2.5">
          Sign in to access your beautiful cloud gallery.
        </p>

        <button
          onClick={handleGoogle}
          disabled={signingIn}
          className="w-full mt-9 h-14 rounded-2xl bg-white dark:bg-white text-neutral-800 font-semibold text-[15px] flex items-center justify-center gap-3 hover:shadow-lg transition-all border border-black/[0.08] disabled:opacity-70 shadow-sm"
        >
          {signingIn ? (
            <Spinner size={20} className="text-brand" />
          ) : (
            <>
              <GoogleIcon />
              Continue with Google
            </>
          )}
        </button>

        <p className="text-xs text-neutral-400 mt-8 leading-relaxed">
          By continuing, you agree to keep your memories safe with us.
          <br />Secure Google authentication. No passwords needed.
        </p>
      </motion.div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  );
}
