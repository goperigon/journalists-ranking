"use client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import Link from "next/link";
import numeral from "numeral";
import { Separator } from "../ui/separator";
import { JournalistSource } from "@/types/journalistSource";
import { useMemo, useState } from "react";
import { JournalistInfo } from "./journalistInfo";
import { SocialIcons } from "./socialIcons";
import { Article } from "@/types/article";
import { useAppStore } from "@/stores/appStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface JournalistDetailsProps {
  journalist: JournalistSource & { articles: Article[] };
}

export function JournalistDetails(props: JournalistDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { journalist } = props;

  const ignoreNoArticleSources = useAppStore(
    (state) => state.ignoreNoArticleSources
  );

  const sortedSourcesByMonthlyVisits = useMemo(
    () => journalist.sources.sort((a, b) => b.monthlyVisits - a.monthlyVisits),
    [journalist.sources]
  );

  return (
    <TooltipProvider>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="cursor-pointer"
      >
        <CollapsibleTrigger asChild>
          <div
            key={journalist.journalist.id}
            className="flex justify-between text-xl gap-x-1 lg:gap-x-4 w-full items-center"
          >
            <div className="flex items-center gap-x-2 lg:gap-x-7">
              <Button variant="ghost" size="sm" className="w-9 p-0">
                {!isOpen && <ChevronDown className="h-4 w-4" />}
                {isOpen && <ChevronUp className="h-4 w-4" />}
              </Button>
              {journalist.journalist.imageUrl && (
                <img
                  className="w-20 h-20"
                  src={journalist.journalist.imageUrl}
                />
              )}
              <Link
                href={journalist.journalist.websiteUrl || "#"}
                className="hover:underline font-semibold text-sm lg:text-base"
              >
                {journalist.journalist.name}
              </Link>
              <SocialIcons
                journalist={journalist.journalist}
                className="hidden lg:flex"
              />
            </div>
            <div className="flex gap-x-1 items-center text-xs md:text-sm lg:text-base font-semibold text-blue-500">
              <Tooltip>
                <TooltipTrigger>
                  <span className="flex gap-x-2">
                    <p>Articles:</p>
                    <p>{journalist.articles.length}</p>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  Number of articles posted by journalist on the selected topic.
                </TooltipContent>
              </Tooltip>
              <span className="text-gray-400 text-xs mx-1">•</span>
              <Tooltip>
                <TooltipTrigger>
                  <span className="flex gap-x-2">
                    <p>Reach:</p>
                    <p>
                      {numeral(journalist.reach).format("0.0a").toUpperCase()}
                    </p>
                  </span>
                </TooltipTrigger>
                <TooltipContent>Top sources monthly visitors</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CollapsibleTrigger>
        <Separator className="my-2" />
        <CollapsibleContent className="flex flex-col">
          <JournalistInfo
            journalistSource={{
              ...journalist,
              sources: sortedSourcesByMonthlyVisits,
            }}
          />
        </CollapsibleContent>
      </Collapsible>
    </TooltipProvider>
  );
}
