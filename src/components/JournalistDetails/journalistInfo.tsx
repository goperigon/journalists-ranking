import { JournalistSource } from "@/types/journalistSource";
import Link from "next/link";
import numeral from "numeral";
import { useMemo } from "react";

interface JournalistInfoProps {
  journalistSource: JournalistSource;
}

export function JournalistInfo(props: JournalistInfoProps) {
  const { journalistSource } = props;

  const sortedSourcesByMonthlyVisits = useMemo(
    () =>
      journalistSource.sources.sort(
        (a, b) => b.monthlyVisits - a.monthlyVisits
      ),
    [journalistSource.sources]
  );

  return (
    <div className="flex px-6 pt-4 pb-10 flex-col gap-y-2">
      <span className="text-lg font-semibold">
        Title: {journalistSource.journalist.title}
      </span>
      <div className="flex flex-col">
        <span className="text-lg font-semibold">Top Sources:</span>
        {sortedSourcesByMonthlyVisits.map((source, idx) => (
          <div className="flex gap-x-4" key={source.id || idx}>
            {/* <span className="text-base font-normal">{source.name}</span> */}
            <a
              className="text-blue-400 hover:underline"
              href={`https://${source.domain}`}
              target="_blank"
            >
              <span className="text-base font-normal">
                {source.name || source.domain || "(N/A)"}{" "}
                {source.name ? `(${source.domain})` : ""}
              </span>
            </a>
            <span className="text-base font-bold">
              {numeral(source.monthlyVisits).format("0.0a")}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-x-1.5 items-center flex-wrap">
        <span className="text-lg font-semibold mr-2">Top Topics:</span>
        {journalistSource.journalist.topTopics.map((topic, idx) => (
          <>
            <Link
              href={`?topic=${topic.name}`}
              className="text-blue-400 hover:underline"
            >
              <span className="text-sm text-nowrap">{topic.name}</span>
            </Link>
            <span className="text-gray-400 text-xs">•</span>
          </>
        ))}
      </div>
    </div>
  );
}
