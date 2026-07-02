import { PracticeClient } from "@/components/PracticeClient";
import { getQuizQuestions } from "@/lib/content";

export default function PracticePage() {
  const questions = getQuizQuestions();

  return <PracticeClient questions={questions} />;
}
