"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { QuizQuestion, QuizSource, UnitMetadata } from "@/lib/types";
import {
  loadCloudStudyHistory,
  syncPracticeAttempt
} from "@/lib/supabase/study-sync";

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
  clue: { label: "線索", className: "border-sky/25 bg-sky/10 text-sky" },
  structure: { label: "結構", className: "border-gold/30 bg-gold/15 text-gold" },
  answer: { label: "答案", className: "border-leaf/25 bg-leaf/10 text-leaf" },
  warning: { label: "陷阱", className: "border-coral/25 bg-coral/10 text-coral" }
};

function parseInitialUnits(value?: string) {
  return (value ?? "")
    .split(",")
    .map(Number)
    .filter((item) => Number.isInteger(item) && item > 0);
}

type StudyHistory = {
  seen: Record<string, number>;
  wrongTopics: Record<string, number>;
  wrongUnits: Record<string, number>;
  completedSets: number;
};

const emptyHistory: StudyHistory = {
  seen: {},
  wrongTopics: {},
  wrongUnits: {},
  completedSets: 0
};
const historyKey = "grammar-study-history-v1";

function stableNumber(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

export function PracticeClient({
  questions,
  units,
  initialUnits,
  initialSource
}: {
  questions: QuizQuestion[];
  units: UnitMetadata[];
  initialUnits?: string;
  initialSource?: string;
}) {
  const initial = parseInitialUnits(initialUnits);
  const [source, setSource] = useState<(typeof sources)[number]>(
    sources.includes(initialSource as (typeof sources)[number])
      ? (initialSource as (typeof sources)[number])
      : "All"
  );
  const [selectedUnits, setSelectedUnits] = useState<number[]>(initial);
  const [questionLimit, setQuestionLimit] = useState(10);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState<StudyHistory>(emptyHistory);
  const [historyReady, setHistoryReady] = useState(false);
  const [sessionSeed, setSessionSeed] = useState(0);
  const [syncStatus, setSyncStatus] = useState<
    "local" | "syncing" | "synced" | "error"
  >("local");

  useEffect(() => {
    let local = emptyHistory;
    try {
      const saved = window.localStorage.getItem(historyKey);
      if (saved) {
        local = { ...emptyHistory, ...(JSON.parse(saved) as StudyHistory) };
        setHistory(local);
      }
    } catch {
      // A blocked or malformed local store should not block practice.
    }
    setHistoryReady(true);
    setSyncStatus("syncing");
    void loadCloudStudyHistory(local)
      .then(({ history: merged, connected }) => {
        setHistory(merged);
        window.localStorage.setItem(historyKey, JSON.stringify(merged));
        setSyncStatus(connected ? "synced" : "local");
      })
      .catch(() => setSyncStatus("error"));
  }, []);

  const groups = useMemo(() => {
    const result = new Map<string, UnitMetadata[]>();
    units.forEach((unit) =>
      result.set(unit.part, [...(result.get(unit.part) ?? []), unit])
    );
    return Array.from(result.entries());
  }, [units]);

  const pool = useMemo(
    () =>
      questions.filter((question) => {
        const sourceMatch = source === "All" || question.source === source;
        const unitMatch =
          selectedUnits.length === 0 || selectedUnits.includes(question.unit);
        return sourceMatch && unitMatch;
      }),
    [questions, selectedUnits, source]
  );
  const orderedPool = useMemo(() => {
    return [...pool].sort((left, right) => {
      const score = (question: QuizQuestion) => {
        const unseen = history.seen[question.id] ? 0 : 100_000;
        const topicNeed = (history.wrongTopics[question.topic] ?? 0) * 3_000;
        const unitNeed = (history.wrongUnits[String(question.unit)] ?? 0) * 800;
        const rotation =
          stableNumber(`${sessionSeed + history.completedSets}:${question.id}`) %
          700;
        return unseen + topicNeed + unitNeed + rotation;
      };
      return score(right) - score(left);
    });
  }, [history, pool, sessionSeed]);
  const filtered = orderedPool.slice(0, questionLimit);
  const score = filtered.reduce(
    (total, question) =>
      total + (answers[question.id] === question.answer ? 1 : 0),
    0
  );
  const accuracy = filtered.length
    ? Math.round((score / filtered.length) * 100)
    : 0;

  const clearAttempt = () => {
    setAnswers({});
    setSubmitted(false);
  };
  const submitAttempt = () => {
    if (submitted || filtered.length === 0) {
      setSubmitted(true);
      return;
    }
    const next: StudyHistory = {
      seen: { ...history.seen },
      wrongTopics: { ...history.wrongTopics },
      wrongUnits: { ...history.wrongUnits },
      completedSets: history.completedSets + 1
    };
    filtered.forEach((question) => {
      next.seen[question.id] = (next.seen[question.id] ?? 0) + 1;
      if (answers[question.id] !== question.answer) {
        next.wrongTopics[question.topic] =
          (next.wrongTopics[question.topic] ?? 0) + 1;
        const unitKey = String(question.unit);
        next.wrongUnits[unitKey] = (next.wrongUnits[unitKey] ?? 0) + 1;
      } else {
        next.wrongTopics[question.topic] = Math.max(
          0,
          (next.wrongTopics[question.topic] ?? 0) - 1
        );
      }
    });
    setHistory(next);
    try {
      window.localStorage.setItem(historyKey, JSON.stringify(next));
    } catch {
      // Practice still works when persistence is unavailable.
    }
    setSyncStatus("syncing");
    void syncPracticeAttempt({
      history: next,
      questions: filtered,
      answers,
      selectedUnits,
      source,
      score
    })
      .then((connected) => setSyncStatus(connected ? "synced" : "local"))
      .catch(() => setSyncStatus("error"));
    setSubmitted(true);
  };
  const nextSet = () => {
    setSessionSeed((current) => current + 1);
    clearAttempt();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const applyUnits = (next: number[]) => {
    setSelectedUnits(next);
    clearAttempt();
  };
  const toggleUnit = (unit: number) => {
    applyUnits(
      selectedUnits.includes(unit)
        ? selectedUnits.filter((item) => item !== unit)
        : [...selectedUnits, unit].sort((a, b) => a - b)
    );
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-ink/10 bg-white p-5 shadow-soft md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-sky">
              自訂練習
            </p>
            <h2 className="mt-2 text-3xl font-bold text-ink">
              選單元，組出自己的測驗
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/70">
              可只練一個單元，也可把相似文法整組加入，做跨單元辨識。
              未選單元時會從全題庫出題。
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-xl bg-mist p-3 text-center">
            <Metric label="已選單元" value={selectedUnits.length || "全部"} />
            <Metric label="本次題數" value={filtered.length} />
            <Metric
              label="成績"
              value={submitted ? `${score}/${filtered.length}` : "—"}
            />
          </div>
        </div>
        {historyReady ? (
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-leaf/10 px-3 py-1.5 font-semibold text-leaf">
              已完成 {history.completedSets} 組
            </span>
            <span className="rounded-full bg-sky/10 px-3 py-1.5 font-semibold text-sky">
              已看過 {Object.keys(history.seen).length}/{questions.length} 題
            </span>
            <span className="rounded-full bg-coral/10 px-3 py-1.5 font-semibold text-coral">
              系統會優先安排新題與相似弱項
            </span>
            <span
              className={`rounded-full px-3 py-1.5 font-semibold ${
                syncStatus === "synced"
                  ? "bg-leaf/10 text-leaf"
                  : syncStatus === "error"
                    ? "bg-coral/10 text-coral"
                    : "bg-mist text-ink/55"
              }`}
            >
              {syncStatus === "synced"
                ? "雲端已同步"
                : syncStatus === "syncing"
                  ? "同步中…"
                  : syncStatus === "error"
                    ? "雲端暫時失敗，已保留本機紀錄"
                    : "本機模式"}
            </span>
          </div>
        ) : null}

        <div className="mt-6 rounded-xl border border-ink/10 bg-mist/35 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-ink">1. 選擇文法範圍</h3>
              <p className="mt-1 text-xs text-ink/55">
                點群組可一次選取相似單元；再點個別章節微調。
              </p>
            </div>
            <button
              type="button"
              onClick={() => applyUnits([])}
              className="rounded-md bg-white px-3 py-2 text-xs font-semibold text-ink/65 ring-1 ring-ink/10"
            >
              清除選擇（全範圍）
            </button>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {groups.map(([part, partUnits]) => {
              const allSelected = partUnits.every((item) =>
                selectedUnits.includes(item.unit)
              );
              return (
                <details
                  key={part}
                  className="group rounded-lg border border-ink/10 bg-white"
                  open={partUnits.some((item) => selectedUnits.includes(item.unit))}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-3">
                    <span>
                      <span className="block text-sm font-bold text-ink">{part}</span>
                      <span className="text-xs text-ink/50">
                        Units {partUnits[0].unit}–{partUnits.at(-1)?.unit} ·{" "}
                        {partUnits.filter((item) => selectedUnits.includes(item.unit)).length}/
                        {partUnits.length} selected
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        const ids = partUnits.map((item) => item.unit);
                        applyUnits(
                          allSelected
                            ? selectedUnits.filter((item) => !ids.includes(item))
                            : Array.from(new Set([...selectedUnits, ...ids])).sort(
                                (a, b) => a - b
                              )
                        );
                      }}
                      className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                        allSelected
                          ? "bg-leaf text-white"
                          : "bg-mist text-leaf"
                      }`}
                    >
                      {allSelected ? "取消整組" : "選擇整組"}
                    </button>
                  </summary>
                  <div className="flex flex-wrap gap-2 border-t border-ink/10 p-3">
                    {partUnits.map((item) => (
                      <button
                        key={item.unit}
                        type="button"
                        title={item.title}
                        onClick={() => toggleUnit(item.unit)}
                        className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition ${
                          selectedUnits.includes(item.unit)
                            ? "bg-leaf text-white"
                            : "bg-mist/70 text-ink/65 hover:bg-mist"
                        }`}
                      >
                        {item.unit}
                      </button>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-ink/10 p-4">
          <h3 className="font-bold text-ink">2. 設定測驗</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {[10, 20, 40].map((limit) => (
              <button
                key={limit}
                type="button"
                onClick={() => {
                  setQuestionLimit(limit);
                  clearAttempt();
                }}
                className={`rounded-md px-3 py-2 text-sm font-semibold ${
                  questionLimit === limit
                    ? "bg-sky text-white"
                    : "bg-mist text-ink/65"
                }`}
              >
                {limit} 題
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setQuestionLimit(pool.length);
                clearAttempt();
              }}
              className="rounded-md bg-mist px-3 py-2 text-sm font-semibold text-ink/65"
            >
              全部 {pool.length} 題
            </button>
            <select
              value={source}
              onChange={(event) => {
                setSource(event.target.value as (typeof sources)[number]);
                clearAttempt();
              }}
              className="rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-ink/70"
            >
              {sources.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "所有題型" : item}
                </option>
              ))}
            </select>
          </div>
          {selectedUnits.length > 0 ? (
            <p className="mt-3 text-xs text-ink/55">
              目前範圍：Units {selectedUnits.join(", ")}
            </p>
          ) : null}
        </div>
      </section>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-ink/10 bg-white p-6 text-sm text-ink/65 shadow-soft">
            這個篩選組合目前沒有題目，請改選「所有題型」或其他單元。
          </div>
        ) : null}
        {filtered.map((question, index) => {
          const selected = answers[question.id];
          const isCorrect = selected === question.answer;
          return (
            <article
              key={question.id}
              className="rounded-xl border border-ink/10 bg-white p-5 shadow-soft"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">
                    第 {index + 1} 題 · Unit {question.unit} · {question.source}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-ink">
                    {question.prompt}
                  </h3>
                  <p className="mt-1 text-sm text-ink/55">{question.topic}</p>
                </div>
                {submitted ? (
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isCorrect ? "bg-leaf/10 text-leaf" : "bg-coral/10 text-coral"}`}>
                    {isCorrect ? "答對" : "需要複習"}
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
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition ${
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
                          setAnswers((current) => ({ ...current, [question.id]: choice }))
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
                  <p className="text-sm font-semibold text-ink">答案：{question.answer}</p>
                  <p className="mt-2 text-sm leading-6 text-ink/75">EN: {question.explanationEn}</p>
                  <p className="mt-1 text-sm leading-6 text-ink/75">中：{question.explanationZh}</p>
                  {question.breakdown ? (
                    <div className="mt-4 grid gap-3 lg:grid-cols-2">
                      {question.breakdown.map((item) => {
                        const style = breakdownStyles[item.tone];
                        return (
                          <div key={`${question.id}-${item.label}`} className={`rounded-md border p-3 ${style.className}`}>
                            <p className="text-xs font-bold uppercase tracking-wide">
                              {style.label} · {item.label}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-ink/75">{item.text}</p>
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

      <div className="sticky bottom-4 flex flex-wrap items-center gap-3 rounded-xl border border-ink/10 bg-white/95 p-4 shadow-soft backdrop-blur">
        <button type="button" onClick={submitAttempt} className="rounded-md bg-leaf px-4 py-2 text-sm font-semibold text-white">
          交卷並看解析
        </button>
        {submitted ? (
          <button
            type="button"
            onClick={nextSet}
            className="rounded-md bg-sky px-4 py-2 text-sm font-semibold text-white"
          >
            下一組新題
          </button>
        ) : null}
        <button type="button" onClick={clearAttempt} className="rounded-md border border-ink/10 px-4 py-2 text-sm font-semibold text-ink/70">
          重新作答
        </button>
        <p className="text-sm text-ink/55">
          已作答 {Object.keys(answers).filter((id) => filtered.some((q) => q.id === id)).length}/{filtered.length}
          {submitted ? ` · 正確率 ${accuracy}%` : ""}
        </p>
        {submitted && score < filtered.length ? (
          <Link href="/wrong-answers" className="ml-auto text-sm font-semibold text-coral hover:underline">
            前往錯題整理 →
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="min-w-20 rounded-lg bg-white px-3 py-2">
      <p className="text-xs text-ink/50">{label}</p>
      <p className="mt-1 text-lg font-bold text-leaf">{value}</p>
    </div>
  );
}
