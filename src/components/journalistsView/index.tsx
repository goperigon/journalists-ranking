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
  const journalistSources = useAppStore((state) => state.journalistSources);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const setIsNoJournalistsFound = useAppStore(
    (state) => state.setIsNoJournalistsFound
  );
  const setError = useAppStore((state) => state.setError);
  const setJournalistSources = useAppStore(
    (state) => state.setJournalistSources
  );

  const isReady =
    !isLoading &&
    !error &&
    !isNoJournalistsFound &&
    journalistSources.length !== 0;

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
        {!isLoading && journalistSources.length > 0 && (
          <JournalistsReachChart
            journalistSources={journalistSources.slice(0, 9)}
          />
        )}
      </div>
    </>
  );
}
