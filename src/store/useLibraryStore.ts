import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Resource } from '@/types/resource';
import { resources } from '@/data/resources';

interface LibraryState {
  searchQuery: string;
  activeCategory: string;
  favorites: string[]; // Array of Resource IDs
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: string) => void;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      searchQuery: '',
      activeCategory: 'All',
      favorites: [],
      setSearchQuery: (query) => set({ searchQuery: query }),
      setActiveCategory: (category) => set({ activeCategory: category }),
      addFavorite: (id) => set((state) => ({
        favorites: state.favorites.includes(id) ? state.favorites : [...state.favorites, id]
      })),
      removeFavorite: (id) => set((state) => ({
        favorites: state.favorites.filter((favId) => favId !== id)
      })),
      toggleFavorite: (id) => {
        const { favorites, addFavorite, removeFavorite } = get();
        if (favorites.includes(id)) {
          removeFavorite(id);
        } else {
          addFavorite(id);
        }
      },
      isFavorite: (id) => get().favorites.includes(id),
    }),
    {
      name: 'library-storage', // name of the item in the storage (must be unique)
    }
  )
);
