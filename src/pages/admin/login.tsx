import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, LockKeyhole } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Sign-in failed.");
      const requested = new URLSearchParams(window.location.search).get("next");
      const next = requested?.startsWith("/admin") && requested !== "/admin/login" ? requested : "/admin/leads";
      setLocation(next);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not sign in. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#eaf1fb] px-5 py-12">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-navy/10">
        <span className="grid size-12 place-items-center rounded-2xl bg-blue/10 text-blue">
          <LockKeyhole aria-hidden="true" />
        </span>
        <p className="mt-6 font-mono text-[0.65rem] font-bold uppercase tracking-[0.16em] text-blue">Coast to Coast Air · Admin</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-navy">Sign in to your CRM</h1>
        <p className="mt-2 text-sm leading-relaxed text-navy/60">Enter the private dashboard password to continue.</p>
        <label className="mt-6 block text-sm font-semibold text-navy" htmlFor="crm-password">Password</label>
        <input
          id="crm-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-navy outline-none focus:border-blue focus:ring-2 focus:ring-blue/20"
        />
        {error && <p role="alert" className="mt-3 text-sm font-medium text-red-700">{error}</p>}
        <button disabled={busy} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange px-4 py-3 font-bold text-white disabled:opacity-60">
          {busy ? "Checking…" : "Continue"}
          {!busy && <ArrowRight className="size-4" aria-hidden="true" />}
        </button>
      </form>
    </main>
  );
}
