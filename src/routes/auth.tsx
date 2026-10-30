import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { field } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/auth")({
  head: () => seo("Staff sign in", "Sign in to manage Momento orders."),
  component: Auth,
});

function Auth() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<string>();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(undefined);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
      if (error) return setMsg(error.message);
      nav({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({ email, password: pw, options: { emailRedirectTo: window.location.origin + "/admin" } });
      setMsg(error ? error.message : "Check your email to confirm your account.");
    }
  };
  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <p className="eyebrow">Momento staff</p>
      <h1 className="mt-3 text-4xl">{mode === "in" ? "Sign in" : "Create account"}</h1>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <input className={field} type="email" required placeholder="Email" aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className={field} type="password" required minLength={6} placeholder="Password" aria-label="Password" value={pw} onChange={(e) => setPw(e.target.value)} />
        {msg && <p role="alert" className="text-sm text-destructive">{msg}</p>}
        <button className="h-11 w-full rounded-full bg-primary font-semibold text-primary-foreground">{mode === "in" ? "Sign in" : "Create account"}</button>
      </form>
      <button onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-4 text-sm font-semibold text-primary underline">{mode === "in" ? "Need an account?" : "Have an account? Sign in"}</button>
    </div>
  );
}
