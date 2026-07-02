import { PracticeClient } from "@/components/PracticeClient";
import { getQuizQuestions, getUnits } from "@/lib/content";

export default async function PracticePage({
  searchParams
}: {
  searchParams: Promise<{ unit?: string; units?: string; source?: string }>;
}) {
  const { unit, units, source } = await searchParams;
  const questions = getQuizQuestions();

  return (
    <PracticeClient
      questions={questions}
      units={getUnits()}
      initialUnits={units ?? unit}
      initialSource={source}
    />
  );
}
