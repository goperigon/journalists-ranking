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
import { useState } from "react";
import { JournalistDetails } from "../JournalistDetails";

export function JournalistsList() {
  const [isOpen, setIsOpen] = useState(false);

  const setJournalistSources = useAppStore(
    (state) => state.setJournalistSources
  );

  const journalistSources = useAppStore((state) => state.journalistSources);

  return (
    <section className="flex flex-col w-full">
      <div className="flex items-center justify-between space-x-4 px-4 mb-4">
        <h3 className="font-semibold text-xl">Journalists List</h3>
      </div>
      <ScrollArea className="rounded-md border w-full h-[40rem]">
        <div className="flex flex-col p-4 w-full">
          {journalistSources.map((journalist) => (
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
