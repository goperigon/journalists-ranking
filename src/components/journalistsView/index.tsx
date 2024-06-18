"use client";

import { useAppStore } from "@/stores/appStore";
import { JournalistsReachChart } from "../JournalistsReachChart";
import { JournalistsList } from "../JournalistsList";

export function JournalistsView() {
  const isLoading = useAppStore((state) => state.isLoading);
  const isNoJournalistsFound = useAppStore(
    (state) => state.isNoJournalistsFound
  );
  const error = useAppStore((state) => state.error);
  const journalistSourcesWithArticles = useAppStore(
    (state) => state.journalistSourcesWithArticles
  );

  const isReady =
    !isLoading &&
    !error &&
    !isNoJournalistsFound &&
    journalistSourcesWithArticles.length !== 0;

  return (
    <>
      {isReady && <JournalistsList />}
      <div className="flex flex-col mt-10">
        {!isLoading && !error && isNoJournalistsFound && (
          <p className="text-lg font-semibold text-center text-red-500">
            No Journalists Found. Please adjust your search!
          </p>
        )}
        {!isLoading && error && (
          <p className="text-lg font-semibold text-center text-red-500">
            {error}
          </p>
        )}
        {!isLoading && journalistSourcesWithArticles.length > 0 && (
          <JournalistsReachChart
            journalistSourcesWithArticles={journalistSourcesWithArticles}
          />
        )}
      </div>
    </>
  );
}
