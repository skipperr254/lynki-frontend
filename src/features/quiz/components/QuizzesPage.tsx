import { Header } from "@/components/layout/Header";
import { QuizList } from "./QuizList";

export function QuizzesPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background p-6 md:p-12 pt-28">
        <div className="max-w-7xl mx-auto">
          <QuizList />
        </div>
      </div>
    </>
  );
}
