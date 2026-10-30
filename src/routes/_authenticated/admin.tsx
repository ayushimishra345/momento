import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { inr } from "@/lib/products";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => seo("Orders admin", "Inspect Momento orders and payment statuses."),
  component: Admin,
});

const FULFIL = ["pending", "payment_failed", "paid", "confirmed", "dispatched", "delivered", "cancelled"] as const;

function Admin() {
  const qc = useQueryClient();
  const nav = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: u.user!.id, _role: "admin" });
      if (!isAdmin) return { isAdmin: false as const, orders: [] };
      const { data: orders } = await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }).limit(200);
      return { isAdmin: true as const, orders: orders ?? [] };
    },
  });
  const signOut = async () => { qc.clear(); await supabase.auth.signOut(); nav({ to: "/auth", replace: true }); };
  const setStatus = async (id: string, patch: Record<string, string>) => {
    await supabase.from("orders").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  };

  if (isLoading) return <p className="py-24 text-center text-muted-foreground">Loading…</p>;
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between"><h1 className="text-4xl">Orders</h1><button onClick={signOut} className="rounded-full border border-border px-4 py-2 text-sm font-semibold">Sign out</button></div>
      {!data?.isAdmin ? <p className="mt-8 rounded-xl bg-muted p-6">Your account doesn't have admin access.</p> : (
        <div className="mt-8 space-y-4">
          {!data.orders.length && <p className="text-muted-foreground">No orders yet.</p>}
          {data.orders.map((o: any) => (
            <article key={o.id} className="rounded-2xl border border-border bg-card p-5 text-sm">
              <div className="flex flex-wrap items-center gap-3">
                <b className="font-mono">{o.reference}</b>
                {o.test_mode && <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold">TEST</span>}
                <span>{inr(o.total_paise / 100)}</span>
                <span className="uppercase">{o.payment_method}</span>
                <span className="rounded-full bg-muted px-2 py-0.5">payment: {o.payment_status}</span>
                <span className="text-muted-foreground">{new Date(o.created_at).toLocaleString("en-IN")}</span>
              </div>
              <p className="mt-2 text-muted-foreground">{o.customer_name} · {o.customer_phone} · {o.city} {o.pin}</p>
              <ul className="mt-2">{o.order_items.map((i: any) => <li key={i.id}>{i.product_name} × {i.qty}{i.personalisation?.note ? ` — “${i.personalisation.note}”` : ""}</li>)}</ul>
              <div className="mt-3 flex flex-wrap gap-2">
                <select aria-label="Fulfilment status" className="rounded-full border border-border bg-background px-3 py-1.5" value={o.order_status} onChange={(e) => setStatus(o.id, { order_status: e.target.value })}>
                  {FULFIL.map((s) => <option key={s}>{s}</option>)}
                </select>
                {o.payment_method === "cod" && o.payment_status === "unpaid" && <button onClick={() => setStatus(o.id, { payment_status: "paid" })} className="rounded-full bg-primary px-3 py-1.5 font-semibold text-primary-foreground">Mark cash collected</button>}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
