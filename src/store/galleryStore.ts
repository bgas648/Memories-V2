import { create } from 'zustand';
import type { Photo, Album, SortOption, FilterOption } from '../types';
import * as api from '../services/api';

interface GalleryState {
  photos: Photo[];
  albums: Album[];
  loading: boolean;
  loaded: boolean;
  search: string;
  sort: SortOption;
  filter: FilterOption;
  selected: Set<string>;
  selectMode: boolean;
  setSearch: (s: string) => void;
  setSort: (s: SortOption) => void;
  setFilter: (f: FilterOption) => void;
  loadAll: () => Promise<void>;
  refreshAlbums: () => Promise<void>;
  addPhotos: (photos: Photo[]) => void;
  toggleFavorite: (id: string) => Promise<void>;
  softDelete: (id: string) => Promise<void>;
  restore: (id: string) => Promise<void>;
  purge: (id: string) => Promise<void>;
  setAlbumForPhoto: (id: string, albumId: string | null) => Promise<void>;
  toggleSelect: (id: string) => void;
  clearSelect: () => void;
  setSelectMode: (v: boolean) => void;
  selectAll: (ids: string[]) => void;
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
  photos: [],
  albums: [],
  loading: false,
  loaded: false,
  search: '',
  sort: 'newest',
  filter: 'all',
  selected: new Set(),
  selectMode: false,
  setSearch: (search) => set({ search }),
  setSort: (sort) => set({ sort }),
  setFilter: (filter) => set({ filter }),
  loadAll: async () => {
    set({ loading: true });
    try {
      const [photos, albums] = await Promise.all([api.fetchPhotos(), api.fetchAlbums()]);
      set({ photos, albums, loaded: true });
    } finally {
      set({ loading: false });
    }
  },
  refreshAlbums: async () => {
    const albums = await api.fetchAlbums();
    set({ albums });
  },
  addPhotos: (newPhotos) => set((s) => ({ photos: [...newPhotos, ...s.photos] })),
  toggleFavorite: async (id) => {
    const photo = get().photos.find((p) => p.id === id);
    if (!photo) return;
    const next = !photo.is_favorite;
    set((s) => ({ photos: s.photos.map((p) => (p.id === id ? { ...p, is_favorite: next } : p)) }));
    await api.updatePhoto(id, { is_favorite: next });
  },
  softDelete: async (id) => {
    set((s) => ({
      photos: s.photos.map((p) => (p.id === id ? { ...p, is_deleted: true, deleted_at: new Date().toISOString() } : p)),
    }));
    await api.deletePhoto(id, false);
  },
  restore: async (id) => {
    set((s) => ({ photos: s.photos.map((p) => (p.id === id ? { ...p, is_deleted: false, deleted_at: null } : p)) }));
    await api.updatePhoto(id, { is_deleted: false });
  },
  purge: async (id) => {
    set((s) => ({ photos: s.photos.filter((p) => p.id !== id) }));
    await api.deletePhoto(id, true);
  },
  setAlbumForPhoto: async (id, albumId) => {
    set((s) => ({ photos: s.photos.map((p) => (p.id === id ? { ...p, album_id: albumId } : p)) }));
    await api.updatePhoto(id, { album_id: albumId });
    await get().refreshAlbums();
  },
  toggleSelect: (id) =>
    set((s) => {
      const next = new Set(s.selected);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selected: next };
    }),
  clearSelect: () => set({ selected: new Set(), selectMode: false }),
  setSelectMode: (v) => set({ selectMode: v, selected: v ? get().selected : new Set() }),
  selectAll: (ids) => set({ selected: new Set(ids) }),
}));
