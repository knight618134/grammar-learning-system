"use client";

import { useMemo, useState } from "react";
import type { QuizQuestion, QuizSource } from "@/lib/types";

const sources: Array<"All" | QuizSource> = [
  "All",
  "Grammar",
  "TOEIC",
  "IELTS",
  "Daily English",
  "Phrases",
  "Native Usage"
];

const breakdownStyles = {
  clue: {
    label: "Clue",
    className: "border-sky/25 bg-sky/10 text-sky"
  },
  structure: {
    label: "Structure",
    className: "border-gold/30 bg-gold/15 text-gold"
  },
  answer: {
    label: "Answer",
    className: "border-leaf/25 bg-leaf/10 text-leaf"
  },
  warning: {
    label: "Trap",
    className: "border-coral/25 bg-coral/10 text-coral"
  }
};

export function PracticeClient({
  questions,
  initialUnit
}: {
  questions: QuizQuestion[];
  initialUnit?: string;
}) {
  const [source, setSource] = useState<(typeof sources)[number]>("All");
  const [unit, setUnit] = useState(initialUnit ?? "All");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const unitOptions = useMemo(() => {
    const units = Array.from(new Set(questions.map((question) => question.unit)));
    return units.sort((a, b) => a - b);
  }, [questions]);

  const filtered = useMemo(() => {
    return questions.filter((question) => {
      const sourceMatch = source === "All" || question.source === source;
      const unitMatch = unit === "All" || question.unit === Number(unit);

      return sourceMatch && unitMatch;
    });
  }, [questions, source, unit]);

  const score = filtered.reduce((total, question) => {
    return total + (answers[question.id] === question.answer ? 1 : 0);
  }, 0);

  const accuracy =
    filtered.length > 0 ? Math.round((score / filtered.length) * 100) : 0;

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-sky">
              Practice
            </p>
            <h2 className="mt-2 text-3xl font-bold text-ink">
              Mixed Grammar Questions
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/70">
              Choose answers, submit, then review English and Chinese
              explanations. The question bank mixes grammar, TOEIC, IELTS, daily
              English, useful phrases, and native-like usage.
            </p>
          </div>
          <div className="rounded-lg bg-mist p-4 text-sm">
            <p className="font-semibold text-ink">Score</p>
            <p className="mt-1 text-2xl font-bold text-leaf">
              {submitted ? `${score}/${filtered.length}` : "-"}
            </p>
            <p className="text-xs text-ink/55">
              {submitted ? `${accuracy}% accuracy` : "Submit to check"}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <select
            value={unit}
            onChange={(event) => {
              setUnit(event.target.value);
              setAnswers({});
              setSubmitted(false);
            }}
            className="rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-ink/70"
          >
            <option value="All">All Units</option>
            {unitOptions.map((item) => (
              <option key={item} value={item}>
                Unit {item}
              </option>
            ))}
          </select>
          {sources.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setSource(item);
                setAnswers({});
                setSubmitted(false);
              }}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                source === item
                  ? "bg-leaf text-white"
                  : "bg-white text-ink/65 ring-1 ring-ink/10 hover:bg-mist"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-ink/10 bg-white p-6 text-sm text-ink/65 shadow-soft">
            No questions match this filter yet.
          </div>
        ) : null}
        {filtered.map((question, index) => {
          const selected = answers[question.id];
          const isCorrect = selected === question.answer;

          return (
            <article
              key={question.id}
              className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">
                    Question {index + 1} · Unit {question.unit} ·{" "}
                    {question.source}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-ink">
                    {question.prompt}
                  </h3>
                  <p className="mt-1 text-sm text-ink/55">{question.topic}</p>
                </div>
                {submitted ? (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isCorrect
                        ? "bg-leaf/10 text-leaf"
                        : "bg-coral/10 text-coral"
                    }`}
                  >
                    {isCorrect ? "Correct" : "Review"}
                  </span>
                ) : null}
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {question.choices.map((choice) => {
                  const checked = selected === choice;
                  const showCorrect = submitted && choice === question.answer;
                  const showWrong = submitted && checked && !isCorrect;

                  return (
                    <label
                      key={choice}
                      className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm transition ${
                        showCorrect
                          ? "border-leaf/40 bg-leaf/10 text-leaf"
                          : showWrong
                            ? "border-coral/40 bg-coral/10 text-coral"
                            : checked
                              ? "border-sky/40 bg-sky/10 text-sky"
                              : "border-ink/10 bg-mist/30 text-ink/75 hover:bg-mist"
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={choice}
                        checked={checked}
                        onChange={() =>
                          setAnswers((current) => ({
                            ...current,
                            [question.id]: choice
                          }))
                        }
                        className="h-4 w-4 accent-leaf"
                      />
                      <span>{choice}</span>
                    </label>
                  );
                })}
              </div>

              {submitted ? (
                <div className="mt-4 rounded-lg bg-mist/60 p-4">
                  <p className="text-sm font-semibold text-ink">
                    Answer: {question.answer}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink/75">
                    EN: {question.explanationEn}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-ink/75">
                    中：{question.explanationZh}
                  </p>
                  {question.phraseNote ? (
                    <p className="mt-2 rounded-md bg-white p-3 text-sm text-ink/70">
                      Phrase: {question.phraseNote}
                    </p>
                  ) : null}
                  {question.breakdown ? (
                    <div className="mt-4 grid gap-3 lg:grid-cols-2">
                      {question.breakdown.map((item) => {
                        const style = breakdownStyles[item.tone];

                        return (
                          <div
                            key={`${question.id}-${item.label}`}
                            className={`rounded-md border p-3 ${style.className}`}
                          >
                            <p className="text-xs font-bold uppercase tracking-wide">
                              {style.label} · {item.label}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-ink/75">
                              {item.text}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className="sticky bottom-4 flex flex-wrap items-center gap-3 rounded-lg border border-ink/10 bg-white/95 p-4 shadow-soft backdrop-blur">
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          className="rounded-md bg-leaf px-4 py-2 text-sm font-semibold text-white transition hover:bg-leaf/90"
        >
          Submit Answers
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-ink/10 px-4 py-2 text-sm font-semibold text-ink/70 transition hover:bg-mist"
        >
          Reset
        </button>
        <p className="text-sm text-ink/55">
          Answered {Object.keys(answers).length}/{filtered.length}
        </p>
      </div>
    </div>
  );
}
