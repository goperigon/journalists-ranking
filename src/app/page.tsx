import { PerigonLogo } from "@/components/PerigonLogo";
import { TopicForm } from "@/components/TopicForm";
import { JournalistsView } from "@/components/journalistsView";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-4 pb-10">
      <h1 className="flex gap-x-4 items-center font-bold text-4xl mb-10">
        <Link href="https://goperigon.com" target="_blank">
          <PerigonLogo className="w-12 h-12" />
        </Link>
        Perigon Journalists Explorer
      </h1>
      <section className="flex flex-col w-2/3">
        <Suspense fallback={"Loading..."}>
          <TopicForm />
        </Suspense>
        <JournalistsView />
      </section>
    </main>
  );
}
