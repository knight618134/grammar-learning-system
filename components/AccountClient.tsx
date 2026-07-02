"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured
} from "@/lib/supabase/browser";

export function AccountClient() {
  const configured = isSupabaseConfigured();
  const supabase = getSupabaseBrowserClient();
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMessage("");

    const result =
      mode === "signup"
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/account`
            }
          })
        : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setMessage(result.error.message);
    } else if (mode === "signup" && !result.data.session) {
      setMessage("註冊成功，請到信箱完成 Email 驗證後再登入。");
    } else {
      setMessage("登入成功，這台裝置現在會同步學習紀錄。");
    }
    setBusy(false);
  };

  if (!configured) {
    return (
      <section className="rounded-2xl border border-gold/30 bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-gold">
          Cloud setup required
        </p>
        <h2 className="mt-2 text-2xl font-bold text-ink">尚未連接 Supabase</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/70">
          目前仍會正常使用本機模式。建立 Supabase 專案、執行 migration，
          並將環境變數填入 .env.local 後，帳號與跨裝置同步會自動啟用。
        </p>
        <div className="mt-4 rounded-lg bg-mist p-4 text-sm leading-6 text-ink/70">
          設定名稱：NEXT_PUBLIC_SUPABASE_URL、NEXT_PUBLIC_SUPABASE_ANON_KEY
        </div>
      </section>
    );
  }

  if (user) {
    return (
      <section className="rounded-2xl border border-leaf/25 bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-leaf">
          Sync enabled
        </p>
        <h2 className="mt-2 text-2xl font-bold text-ink">跨裝置同步已開啟</h2>
        <p className="mt-3 text-sm text-ink/65">{user.email}</p>
        <p className="mt-2 max-w-xl text-sm leading-6 text-ink/65">
          使用相同帳號登入 iPhone、iPad 與電腦後，作答紀錄和弱項會寫入同一份雲端資料。
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/practice"
            className="rounded-lg bg-leaf px-4 py-2 text-sm font-semibold text-white"
          >
            開始練習
          </Link>
          <button
            type="button"
            onClick={() => void supabase?.auth.signOut()}
            className="rounded-lg border border-ink/10 px-4 py-2 text-sm font-semibold text-ink/65"
          >
            登出
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-lg rounded-2xl border border-ink/10 bg-white p-6 shadow-soft">
      <p className="text-sm font-semibold uppercase tracking-wide text-leaf">
        Grammar Cloud
      </p>
      <h2 className="mt-2 text-2xl font-bold text-ink">
        {mode === "signin" ? "登入學習帳號" : "建立學習帳號"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-ink/65">
        同一個帳號可在 iPhone、iPad 與電腦同步，不需要另外輸入裝置碼。
      </p>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <label className="block text-sm font-semibold text-ink/65">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 min-h-12 w-full rounded-lg border border-ink/10 bg-mist/40 px-3 text-base text-ink outline-none focus:border-leaf"
          />
        </label>
        <label className="block text-sm font-semibold text-ink/65">
          密碼
          <input
            type="password"
            required
            minLength={8}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 min-h-12 w-full rounded-lg border border-ink/10 bg-mist/40 px-3 text-base text-ink outline-none focus:border-leaf"
          />
        </label>
        {message ? (
          <p className="rounded-lg bg-mist p-3 text-sm text-ink/70">{message}</p>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="min-h-12 w-full rounded-lg bg-leaf px-4 font-semibold text-white disabled:opacity-50"
        >
          {busy ? "處理中…" : mode === "signin" ? "登入並同步" : "建立帳號"}
        </button>
      </form>
      <button
        type="button"
        onClick={() => {
          setMode((current) => (current === "signin" ? "signup" : "signin"));
          setMessage("");
        }}
        className="mt-4 w-full text-sm font-semibold text-sky"
      >
        {mode === "signin" ? "還沒有帳號？建立帳號" : "已經有帳號？返回登入"}
      </button>
    </section>
  );
}
