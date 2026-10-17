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

- Report content lives only in `src/data/resultados.ts`; components in `src/components/reporte.tsx` receive it via props. Why: single source for experimental data.
- All visual effects live in `src/efectos.ts` (no animation libraries); hidden states apply only under `html.js`. Why: page must read fully without JS and port to static HTML.
