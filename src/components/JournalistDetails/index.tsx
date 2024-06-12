"use client";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Facebook,
  Globe2,
  Linkedin,
  Twitter,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import Link from "next/link";
import numeral from "numeral";
import { Separator } from "../ui/separator";
import { Journalist } from "@/types/journalist";
import { JournalistSource } from "@/types/journalistSource";
import { useState } from "react";
import { JournalistInfo } from "./journalistInfo";
import { SocialIcons } from "./socialIcons";

interface JournalistDetailsProps {
  journalist: JournalistSource;
}

export function JournalistDetails(props: JournalistDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { journalist } = props;

  return (
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
              <img className="w-20 h-20" src={journalist.journalist.imageUrl} />
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
          <div className="flex gap-x-2 text-xs md:text-sm lg:text-base font-semibold text-blue-500">
            <p>Reach:</p>
            <p>{numeral(journalist.reach).format("0.0a").toUpperCase()}</p>
          </div>
        </div>
      </CollapsibleTrigger>
      <Separator className="my-2" />
      <CollapsibleContent className="flex flex-col">
        <JournalistInfo journalistSource={journalist} />
      </CollapsibleContent>
    </Collapsible>
  );
}
