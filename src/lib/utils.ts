import { Article } from "@/types/article";
import { JournalistSource } from "@/types/journalistSource";
import { Source } from "@/types/source";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function setMapValue<K, V>(map: Map<K, Set<V>>, key: K, value: V) {
  if (!map.has(key)) {
    map.set(key, new Set([value]));
    return;
  }
  map.get(key)?.add(value);
}

export function calculateJournalistReach(
  journalistSource: JournalistSource & { articles: Article[] },
  ignoreNoArticleSources = false
): number {
  const topSources = journalistSource.sources;
  const tempSources: Source[] = [];

  let reach = 0;
  topSources.forEach((source: Source) => {
    if (ignoreNoArticleSources) {
      const sourceArticles = journalistSource.articles.filter(
        (article) => article.source.domain === source.domain
      );

      if (!sourceArticles || sourceArticles.length === 0) return;
    }

    tempSources.push(source);
    reach +=
      typeof source?.monthlyVisits === "number" ? source.monthlyVisits : 0;
  });

  return reach;
}
