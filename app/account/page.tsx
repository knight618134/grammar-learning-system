import { AccountClient } from "@/components/AccountClient";

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky">
          Account & Sync
        </p>
        <h2 className="mt-2 text-3xl font-bold text-ink">帳號與跨裝置同步</h2>
      </div>
      <AccountClient />
    </div>
  );
}
