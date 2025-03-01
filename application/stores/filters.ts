import { create } from "zustand"

interface FilterState {
  selectedCategory: string | null;
  selectedRinglet: string | null;
  setCategory: (category: string | null) => void;
  setRinglet: (ringlet: string | null) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  selectedCategory: null,
  selectedRinglet: null,
  setCategory: (category) =>
    set({
      selectedCategory: category,
    }),
  setRinglet: (ringlet) =>
    set({
      selectedRinglet: ringlet,
    }),
  clearFilters: () =>
    set({
      selectedCategory: null,
      selectedRinglet: null,
    }),
}))

