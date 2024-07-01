import { useAppStore } from "@/stores/appStore";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import {
  ChevronsUpDown,
  Facebook,
  Globe2,
  Linkedin,
  Twitter,
  X,
} from "lucide-react";
import Link from "next/link";
import { Separator } from "../ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import numeral from "numeral";
import { useMemo, useState } from "react";
import { JournalistDetails } from "../JournalistDetails";
import { calculateTotalArticles } from "@/lib/utils";

export function JournalistsList() {
  const journalistSourcesWithArticles = useAppStore(
    (state) => state.journalistSourcesWithArticles
  );

  const filteredJournalistSources = useMemo(
    () =>
      journalistSourcesWithArticles.filter((item) => item.articles.length > 0),
    [journalistSourcesWithArticles]
  );

  const sortedJournalistSources = useMemo(
    () => filteredJournalistSources.sort((a, b) => b.reach - a.reach),
    [filteredJournalistSources]
  );

  const totalNumberOfArticles = useMemo(
    () => calculateTotalArticles(journalistSourcesWithArticles),
    [journalistSourcesWithArticles]
  );

  return (
    <section className="flex flex-col w-full mt-12">
      <div className="flex items-center justify-between space-x-4 px-4 mb-4">
        <h3 className="font-semibold text-xl">Journalists List</h3>
        <span className="font-semibold text-sm text-gray-500 dark:text-gray-300">
          Total Articles: {totalNumberOfArticles}
        </span>
      </div>
      <ScrollArea className="rounded-md border w-full h-[40rem]">
        <div className="flex flex-col p-4 w-full overflow-x-auto">
          {sortedJournalistSources.map((journalist) => (
            <JournalistDetails
              key={journalist.journalist.id}
              journalist={journalist}
            />
          ))}
        </div>
      </ScrollArea>
      {/* </CollapsibleContent> */}
      {/* </Collapsible> */}
    </section>
  );
}
