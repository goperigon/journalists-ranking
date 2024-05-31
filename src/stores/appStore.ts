import { Journalist } from "@/types/journalist";
import { Source } from "@/types/source";
import { create } from "zustand";

interface JournalistSource {
  journalist: Journalist;
  sources: Source[];
  reach: number;
}

// Define the types for your store state and actions
interface AppState {
  topic: string;
  isLoading: boolean;
  isNoJournalistsFound: boolean;
  error: string | null;
  journalistSources: JournalistSource[];
  setTopic: (topic: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsNoJournalistsFound: (isNoJournalistsFound: boolean) => void;
  setError: (error: string | null) => void;
  setJournalistSources: (journalistSources: JournalistSource[]) => void;
}

// Create the Zustand store with typings
export const useAppStore = create<AppState>((set) => ({
  topic: "",
  isLoading: false,
  isNoJournalistsFound: false,
  error: null,
  journalistSources: [],
  setTopic: (topic: string) => set({ topic }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setIsNoJournalistsFound: (isNoJournalistsFound: boolean) =>
    set({ isNoJournalistsFound }),
  setError: (error: string | null) => set({ error }),
  setJournalistSources: (journalistSources: JournalistSource[]) =>
    set({ journalistSources }),
}));
