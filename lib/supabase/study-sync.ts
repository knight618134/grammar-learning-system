import type { QuizQuestion } from "@/lib/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export type SyncableStudyHistory = {
  seen: Record<string, number>;
  wrongTopics: Record<string, number>;
  wrongUnits: Record<string, number>;
  completedSets: number;
};

function mergeCounter(
  local: Record<string, number>,
  remote: Record<string, number>
) {
  const merged = { ...remote };
  Object.entries(local).forEach(([key, value]) => {
    merged[key] = Math.max(value, merged[key] ?? 0);
  });
  return merged;
}

export function mergeStudyHistory(
  local: SyncableStudyHistory,
  remote?: Partial<SyncableStudyHistory> | null
): SyncableStudyHistory {
  if (!remote) return local;
  return {
    seen: mergeCounter(local.seen, remote.seen ?? {}),
    wrongTopics: mergeCounter(local.wrongTopics, remote.wrongTopics ?? {}),
    wrongUnits: mergeCounter(local.wrongUnits, remote.wrongUnits ?? {}),
    completedSets: Math.max(local.completedSets, remote.completedSets ?? 0)
  };
}

export async function loadCloudStudyHistory(local: SyncableStudyHistory) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return { history: local, connected: false };

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { history: local, connected: false };

  const { data, error } = await supabase
    .from("study_state")
    .select("state")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (error) throw error;

  const merged = mergeStudyHistory(
    local,
    data?.state as Partial<SyncableStudyHistory> | undefined
  );
  const { error: writeError } = await supabase.from("study_state").upsert({
    user_id: auth.user.id,
    state: merged,
    updated_at: new Date().toISOString()
  });
  if (writeError) throw writeError;

  return { history: merged, connected: true };
}

export async function syncPracticeAttempt({
  history,
  questions,
  answers,
  selectedUnits,
  source,
  score
}: {
  history: SyncableStudyHistory;
  questions: QuizQuestion[];
  answers: Record<string, string>;
  selectedUnits: number[];
  source: string;
  score: number;
}) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return false;
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return false;

  const { data: session, error: sessionError } = await supabase
    .from("practice_sessions")
    .insert({
      user_id: auth.user.id,
      unit_ids:
        selectedUnits.length > 0
          ? selectedUnits
          : Array.from(new Set(questions.map((question) => question.unit))),
      source,
      score,
      total: questions.length,
      completed_at: new Date().toISOString(),
      device_info: navigator.userAgent.slice(0, 500)
    })
    .select("id")
    .single();
  if (sessionError) throw sessionError;

  const answerRows = questions.map((question) => ({
    session_id: session.id,
    user_id: auth.user!.id,
    question_id: question.id,
    unit: question.unit,
    topic: question.topic,
    prompt: question.prompt,
    selected_answer: answers[question.id] ?? null,
    correct_answer: question.answer,
    is_correct: answers[question.id] === question.answer,
    answered_at: new Date().toISOString()
  }));
  const { error: answersError } = await supabase
    .from("attempt_answers")
    .insert(answerRows);
  if (answersError) throw answersError;

  const { error: stateError } = await supabase.from("study_state").upsert({
    user_id: auth.user.id,
    state: history,
    updated_at: new Date().toISOString()
  });
  if (stateError) throw stateError;
  return true;
}
