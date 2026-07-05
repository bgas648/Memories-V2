import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, X, CheckCircle2, AlertCircle, Play, Images } from 'lucide-react';
import { useGalleryStore } from '../store/galleryStore';
import { useToastStore } from '../store/toastStore';
import * as api from '../services/api';
import type { UploadItem } from '../types';
import PageHeader from '../components/ui/PageHeader';
import Spinner from '../components/ui/Spinner';
import { formatBytes } from '../utils/format';

function imageDims(file: File): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) return resolve({ w: 0, h: 0 });
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => resolve({ w: 0, h: 0 });
    img.src = URL.createObjectURL(file);
  });
}

export default function Upload() {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const addPhotos = useGalleryStore((s) => s.addPhotos);
  const push = useToastStore((s) => s.push);
  const navigate = useNavigate();

  const addFiles = useCallback((files: FileList | File[]) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith('image/') || f.type.startsWith('video/'));
    if (valid.length === 0) { push('Only images and videos are supported', 'error'); return; }
    const newItems: UploadItem[] = valid.map((file) => ({
      id: Math.random().toString(36).slice(2),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'pending',
    }));
    setItems((prev) => [...prev, ...newItems]);
  }, [push]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const startUpload = async () => {
    setUploading(true);
    const pending = items.filter((i) => i.status === 'pending' || i.status === 'error');
    let successCount = 0;

    for (const item of pending) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: 'uploading', progress: 0 } : i)));
      try {
        const { url } = await api.uploadFile(item.file, (pct) => {
          setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, progress: pct } : i)));
        });
        const dims = await imageDims(item.file);
        const photo = await api.createPhoto({
          filename: item.file.name,
          url,
          thumb_url: url,
          type: item.file.type.startsWith('video/') ? 'video' : 'image',
          size: item.file.size,
          width: dims.w || null,
          height: dims.h || null,
        });
        addPhotos([photo]);
        setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: 'done', progress: 100 } : i)));
        successCount++;
      } catch (err) {
        console.error(err);
        setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: 'error', error: 'Upload failed' } : i)));
      }
    }
    setUploading(false);
    if (successCount > 0) push(`${successCount} ${successCount === 1 ? 'item' : 'items'} uploaded`);
  };

  const allDone = items.length > 0 && items.every((i) => i.status === 'done');
  const pendingCount = items.filter((i) => i.status === 'pending' || i.status === 'error').length;

  return (
    <div>
      <PageHeader title="Upload" subtitle="Add photos and videos to your gallery" />

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative rounded-3xl border-2 border-dashed transition-all cursor-pointer p-12 sm:p-16 text-center ${
          dragging ? 'border-brand bg-brand/5 scale-[1.01]' : 'border-black/[0.12] dark:border-white/[0.12] hover:border-brand/50 glass'
        }`}
      >
        <input ref={inputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={(e) => e.target.files && addFiles(e.target.files)} />
        <motion.div animate={{ y: dragging ? -6 : 0 }} className="w-16 h-16 rounded-3xl bg-brand/10 flex items-center justify-center mx-auto mb-5">
          <UploadCloud size={30} className="text-brand" />
        </motion.div>
        <h3 className="text-lg font-semibold">{dragging ? 'Drop to upload' : 'Drag & drop your files'}</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">or click to browse · images & videos</p>
      </div>

      {items.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold">{items.length} {items.length === 1 ? 'file' : 'files'}</span>
            <div className="flex gap-2">
              {allDone ? (
                <button onClick={() => navigate('/gallery')} className="px-5 h-11 rounded-full bg-brand text-white text-sm font-medium flex items-center gap-1.5"><Images size={17} /> View Gallery</button>
              ) : (
                <button onClick={startUpload} disabled={uploading || pendingCount === 0} className="px-5 h-11 rounded-full bg-brand text-white text-sm font-medium flex items-center gap-2 disabled:opacity-50">
                  {uploading ? <><Spinner size={16} className="text-white" /> Uploading</> : `Upload ${pendingCount}`}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="relative rounded-2xl overflow-hidden aspect-square bg-neutral-200 dark:bg-neutral-800 group">
                  {item.file.type.startsWith('video/') ? (
                    <>
                      <video src={item.preview} className="w-full h-full object-cover" muted />
                      <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/40 backdrop-blur flex items-center justify-center"><Play size={11} className="text-white ml-0.5" fill="white" /></div>
                    </>
                  ) : (
                    <img src={item.preview} className="w-full h-full object-cover" />
                  )}

                  {(item.status === 'uploading' || item.status === 'pending') && (
                    <div className="absolute inset-0 bg-black/40 flex items-end">
                      <div className="w-full p-2">
                        <div className="h-1.5 rounded-full bg-white/30 overflow-hidden">
                          <motion.div className="h-full bg-brand rounded-full" animate={{ width: `${item.progress}%` }} transition={{ duration: 0.2 }} />
                        </div>
                      </div>
                    </div>
                  )}
                  {item.status === 'done' && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center"><CheckCircle2 size={30} className="text-white" fill="#34C759" /></div>
                  )}
                  {item.status === 'error' && (
                    <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center"><AlertCircle size={28} className="text-white" /></div>
                  )}

                  {item.status !== 'uploading' && item.status !== 'done' && (
                    <button onClick={() => remove(item.id)} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"><X size={13} /></button>
                  )}
                  <div className="absolute bottom-0 inset-x-0 px-2 py-1 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="text-[10px] text-white truncate">{formatBytes(item.file.size)}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
