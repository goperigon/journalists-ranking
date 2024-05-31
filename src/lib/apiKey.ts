"use client";

export const API_KEY_NAME = "perigon-api-key";

export function getApiKey() {
  if (typeof window !== "undefined")
    return window.localStorage.getItem(API_KEY_NAME);
}

export function setApiKey(apiKey: string) {
  if (typeof window !== "undefined")
    window.localStorage.setItem(API_KEY_NAME, apiKey);
}

export function checkIfApiKeyExists() {
  return getApiKey() !== null;
}
