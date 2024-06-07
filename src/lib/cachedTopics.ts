import { PerigonInternalResponse } from "@/types/perigonResponse";
import { expirableLocalStorage } from "expirable-storage";

const EXPIRY = 60 * 60 * 24; ///< 1day
const KEY = "cached-topics";

export function getCachedTopics(): Topic[] | null {
  return expirableLocalStorage.getItem(KEY);
}

export function setCachedTopics(topics: any[]) {
  expirableLocalStorage.setItem(KEY, topics, EXPIRY);
}

/**
 * Add caching capibility to a topics fetcher method
 * @param fetcher
 * @returns Topics[]
 */
export async function withCachedTopics(
  fetcher: () => Promise<PerigonInternalResponse<Topic[]>>
): Promise<Topic[]> {
  const cachedTopics = getCachedTopics();
  if (!cachedTopics) {
    const fetchedTopics = (await fetcher()).data;
    setCachedTopics(fetchedTopics);

    return fetchedTopics;
  }

  return cachedTopics;
}
