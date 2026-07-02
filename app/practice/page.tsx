import { PracticeClient } from "@/components/PracticeClient";
import { getQuizQuestions } from "@/lib/content";

export default async function PracticePage({
  searchParams
}: {
  searchParams: Promise<{ unit?: string }>;
}) {
  const { unit } = await searchParams;
  const questions = getQuizQuestions();

  return <PracticeClient questions={questions} initialUnit={unit} />;
}
