import supabase from '../lib/supabase';
import type { Album, Photo } from '../types';

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function currentUserId(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? '';
}

// ---- Photos ----
export async function fetchPhotos(): Promise<Photo[]> {
  const uid = await currentUserId();
  const res = await fetch(`/api/photos?user_id=${uid}`, { headers: await authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch photos');
  return res.json();
}

export async function createPhoto(payload: Partial<Photo>): Promise<Photo> {
  const uid = await currentUserId();
  const res = await fetch('/api/photos', {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({ ...payload, user_id: uid }),
  });
  if (!res.ok) throw new Error('Failed to create photo');
  return res.json();
}

export async function updatePhoto(id: string, patch: Partial<Photo>): Promise<Photo> {
  const res = await fetch('/api/photos', {
    method: 'PUT',
    headers: await authHeaders(),
    body: JSON.stringify({ id, ...patch }),
  });
  if (!res.ok) throw new Error('Failed to update photo');
  return res.json();
}

export async function deletePhoto(id: string, permanent = false): Promise<void> {
  const res = await fetch('/api/photos', {
    method: 'DELETE',
    headers: await authHeaders(),
    body: JSON.stringify({ id, permanent }),
  });
  if (!res.ok) throw new Error('Failed to delete photo');
}

// ---- Albums ----
export async function fetchAlbums(): Promise<Album[]> {
  const uid = await currentUserId();
  const res = await fetch(`/api/albums?user_id=${uid}`, { headers: await authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch albums');
  return res.json();
}

export async function createAlbum(name: string): Promise<Album> {
  const uid = await currentUserId();
  const res = await fetch('/api/albums', {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({ name, user_id: uid }),
  });
  if (!res.ok) throw new Error('Failed to create album');
  return res.json();
}

export async function updateAlbum(id: string, patch: Partial<Album>): Promise<Album> {
  const res = await fetch('/api/albums', {
    method: 'PUT',
    headers: await authHeaders(),
    body: JSON.stringify({ id, ...patch }),
  });
  if (!res.ok) throw new Error('Failed to update album');
  return res.json();
}

export async function deleteAlbum(id: string): Promise<void> {
  const res = await fetch('/api/albums', {
    method: 'DELETE',
    headers: await authHeaders(),
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error('Failed to delete album');
}

// ---- Storage upload (via service-role API route for reliability) ----
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function uploadFile(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<{ url: string; path: string }> {
  const uid = await currentUserId();
  const base64 = await fileToBase64(file);

  // Simulated progress for UX (fetch upload lacks granular progress here)
  let pct = 0;
  const timer = setInterval(() => {
    pct = Math.min(pct + Math.random() * 16, 90);
    onProgress?.(pct);
  }, 160);

  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: uid,
      fileName: file.name,
      fileBase64: base64,
      contentType: file.type,
    }),
  });
  clearInterval(timer);
  if (!res.ok) throw new Error('Upload failed');
  onProgress?.(100);
  return res.json();
}
