import { Article } from "@/types/article";
import { Journalist } from "@/types/journalist";
import { JournalistSource } from "@/types/journalistSource";
import { Source } from "@/types/source";
import { create } from "zustand";

interface AppState {
  topic: string;
  topics: any[];
  isLoading: boolean;
  isTopicsLoading: boolean;
  isNoJournalistsFound: boolean;
  error: string | null;
  journalistSourcesWithArticles: Array<
    JournalistSource & { articles: Article[] }
  >;
  ignoreNoArticleSources: boolean;
  setIgnoreNoArticleSources: (ignoreNoArticleSources: boolean) => void;
  setTopic: (topic: string) => void;
  setTopics: (topics: any[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsNoJournalistsFound: (isNoJournalistsFound: boolean) => void;
  setError: (error: string | null) => void;
  setJournalistSourcesWithArticles: (
    journalistSourcesWithArticles: Array<
      JournalistSource & { articles: Article[] }
    >
  ) => void;
  setIsTopicsLoading: (isTopicsLoading: boolean) => void;
}

// Create the Zustand store with typings
export const useAppStore = create<AppState>((set) => ({
  topic: "",
  topics: [],
  isLoading: false,
  isTopicsLoading: true,
  isNoJournalistsFound: false,
  error: null,
  journalistSourcesWithArticles: [],
  ignoreNoArticleSources: false,
  setTopic: (topic: string) => set({ topic }),
  setTopics: (topics: any[]) => set({ topics }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setIsNoJournalistsFound: (isNoJournalistsFound: boolean) =>
    set({ isNoJournalistsFound }),
  setError: (error: string | null) => set({ error }),
  setJournalistSourcesWithArticles: (journalistSourcesWithArticles) =>
    set({ journalistSourcesWithArticles }),
  setIsTopicsLoading: (isTopicsLoading: boolean) => set({ isTopicsLoading }),
  setIgnoreNoArticleSources: (ignoreNoArticleSources: boolean) =>
    set({ ignoreNoArticleSources }),
}));
