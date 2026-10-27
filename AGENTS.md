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
- Reuse `Personaliser` for product and cart editing with shared validation in `src/lib/personalisation.ts`; save small local thumbnails so photo editing and retention work consistently.
- Validate browser cart restoration and guard storage writes; unavailable or malformed storage must not break shopping.
