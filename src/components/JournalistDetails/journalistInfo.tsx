import { JournalistSource } from "@/types/journalistSource";
import Link from "next/link";
import numeral from "numeral";
import { useMemo } from "react";
import { SocialIcons } from "./socialIcons";
import { Article } from "@/types/article";
import { TopSources } from "./topSources";

interface JournalistInfoProps {
  journalistSource: JournalistSource & { articles: Article[] };
}

export function JournalistInfo(props: JournalistInfoProps) {
  const { journalistSource } = props;

  return (
    <div className="flex px-6 pt-4 pb-10 flex-col gap-y-2">
      <SocialIcons
        journalist={journalistSource.journalist}
        className="flex lg:hidden mb-4"
      />
      <span className="lg:text-lg font-semibold">
        Title: {journalistSource.journalist.title}
      </span>
      <div className="flex flex-col">
        <TopSources journalistSource={journalistSource} />
      </div>
      <div className="flex gap-x-1.5 items-center flex-wrap">
        <span className="lg:text-lg font-semibold mr-2">Top Topics:</span>
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
