import { TopicForm } from "@/components/TopicForm";
import { JournalistsView } from "@/components/journalistsView";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-4 pb-10">
      <h1 className="font-bold text-4xl mb-10">Journalists Ranking</h1>
      <section className="flex flex-col w-2/3">
        <TopicForm />
        <JournalistsView />
      </section>
    </main>
  );
}
