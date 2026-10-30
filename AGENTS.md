<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep illustrative delivery coverage in `src/lib/delivery.ts` and use its shared lookup for the delivery checker; one source prevents conflicting sample estimates across views.
- Payments: Razorpay order creation, signature verification and webhooks run only server-side (`src/lib/payments.functions.ts`, `src/lib/razorpay.server.ts`, `/api/public/razorpay-webhook`); totals always come from `priceCart` in `src/lib/pricing.ts`, never from the browser.
- Orders are written only by the server (service role); browser reads are admin-only via `has_role` RLS, and customers see status by unguessable reference.
