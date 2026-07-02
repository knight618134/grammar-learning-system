"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
type Font = "sans" | "rounded" | "serif";
type Appearance = { theme: Theme; font: Font; scale: number };

const key = "grammar-appearance-v1";
const defaults: Appearance = { theme: "system", font: "sans", scale: 100 };

function applyAppearance(value: Appearance) {
  const root = document.documentElement;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.classList.toggle(
    "dark",
    value.theme === "dark" || (value.theme === "system" && systemDark)
  );
  root.dataset.font = value.font;
  root.style.fontSize = `${value.scale}%`;
}

export function AppearanceControls() {
  const [appearance, setAppearance] = useState<Appearance>(defaults);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let saved = defaults;
    try {
      saved = {
        ...defaults,
        ...(JSON.parse(window.localStorage.getItem(key) ?? "{}") as Partial<Appearance>)
      };
    } catch {
      // Use accessible defaults if local preferences are malformed.
    }
    setAppearance(saved);
    applyAppearance(saved);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = () => {
      if (saved.theme === "system") applyAppearance(saved);
    };
    media.addEventListener("change", updateSystemTheme);
    return () => media.removeEventListener("change", updateSystemTheme);
  }, []);

  const update = (patch: Partial<Appearance>) => {
    const next = { ...appearance, ...patch };
    setAppearance(next);
    applyAppearance(next);
    window.localStorage.setItem(key, JSON.stringify(next));
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label="顯示與字體設定"
        className="flex min-h-10 items-center gap-2 rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-ink/70 shadow-sm transition hover:bg-mist"
      >
        <span aria-hidden="true">◐</span>
        <span className="hidden sm:inline">顯示</span>
      </button>
      {open ? (
        <div className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-ink/10 bg-white p-4 shadow-soft">
          <p className="font-bold text-ink">閱讀顯示</p>
          <label className="mt-4 block text-xs font-semibold text-ink/55">
            色彩模式
            <select
              value={appearance.theme}
              onChange={(event) => update({ theme: event.target.value as Theme })}
              className="mt-1 min-h-11 w-full rounded-lg border border-ink/10 bg-mist/40 px-3 text-sm text-ink"
            >
              <option value="system">跟隨裝置</option>
              <option value="light">日間模式</option>
              <option value="dark">夜間模式</option>
            </select>
          </label>
          <label className="mt-3 block text-xs font-semibold text-ink/55">
            字型
            <select
              value={appearance.font}
              onChange={(event) => update({ font: event.target.value as Font })}
              className="mt-1 min-h-11 w-full rounded-lg border border-ink/10 bg-mist/40 px-3 text-sm text-ink"
            >
              <option value="sans">清晰黑體</option>
              <option value="rounded">圓體</option>
              <option value="serif">閱讀襯線體</option>
            </select>
          </label>
          <div className="mt-3">
            <p className="text-xs font-semibold text-ink/55">文字大小</p>
            <div className="mt-1 grid grid-cols-3 gap-2">
              {[90, 100, 112].map((scale) => (
                <button
                  key={scale}
                  type="button"
                  onClick={() => update({ scale })}
                  className={`min-h-11 rounded-lg text-sm font-semibold ${
                    appearance.scale === scale
                      ? "bg-leaf text-white"
                      : "bg-mist text-ink/65"
                  }`}
                >
                  {scale === 90 ? "小" : scale === 100 ? "標準" : "大"}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
