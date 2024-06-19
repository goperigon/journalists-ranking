import { useAppStore } from "@/stores/appStore";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

export function FilterJournalists() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="flex flex-col">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-[350px] space-y-2"
      >
        <div className="flex items-center justify-between space-x-4 px-4">
          <h3 className="font-semibold text-xl">Filter Journalists</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-2">
          {/* {journalistSources.map((journalist) => (

          ))} */}
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}
