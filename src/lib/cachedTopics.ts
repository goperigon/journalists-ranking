import { expirableLocalStorage } from "expirable-storage";

const EXPIRY = 60 * 60 * 24; ///< 1day
const KEY = "cached-topics";

export function getCachedTopics() {
  return expirableLocalStorage.getItem(KEY);
}

export function setCachedTopics(topics: any[]) {
  expirableLocalStorage.setItem(KEY, topics, EXPIRY);
}
