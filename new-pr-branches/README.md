# New conflict-free PR branches

Each patch in this directory replaces one of the old draft PRs.  
Apply them with `git am` to create the new branches, then open new PRs and close the old ones.

## What each patch does

| Patch | New branch | Replaces | Issue |
|---|---|---|---|
| `0001-…feud….patch` | `fix/getguildfeud-endpoint-path` | PR #10 | #5 |
| `0002-…events….patch` | `fix/getrecentevents-query-params` | PR #11 | #6 |
| `0003-…alliance….patch` | `feat/alliance-api` | PR #12 | #7 |
| `0004-…kills….patch` | `feat/player-kills-deaths` | PR #13 | #8 |

## Why the patches are conflict-free

The old PRs grouped multiple exports on a single line:

```js
// old — every PR touches the same shared lines → conflict
getGuildInfo, getGuildData, getGuildTopKills, getGuildStats, getGuildMembers, getGuildFued,
getPlayerInfo, getPlayerSoloKills, getPlayerTopKills,
```

Each new branch puts every export on its own line:

```js
// new — each PR only inserts one new line → no conflict
getGuildInfo,
getGuildData,
...
```

## Apply the patches (requires local clone + push access)

```bash
cd /path/to/albion-api

# ── PR replacing #10: fix getGuildFeud endpoint path ──────────────────────
git checkout -b fix/getguildfeud-endpoint-path origin/master
git am new-pr-branches/0001-fix-correct-fued-feud-in-getGuildFeud-rename-functio.patch
git push origin fix/getguildfeud-endpoint-path
gh pr create \
  --base master \
  --head fix/getguildfeud-endpoint-path \
  --title "fix: correct /fued/ → /feud/ in getGuildFeud, keep backward compat alias" \
  --body "Fixes #5. Supersedes PR #10.

- Renames \`getGuildFued\` → \`getGuildFeud\` (correct spelling)
- Fixes the URL path: \`/guilds/{id}/fued/{id2}\` (404) → \`/guilds/{id}/feud/{id2}\` (200)
- Keeps \`getGuildFued\` as a backward-compatible alias
- Exports one per line to prevent future merge conflicts"

# ── PR replacing #11: fix getRecentEvents query params ────────────────────
git checkout -b fix/getrecentevents-query-params origin/master
git am new-pr-branches/0002-fix-pass-query-params-to-events-endpoint-in-getRecen.patch
git push origin fix/getrecentevents-query-params
gh pr create \
  --base master \
  --head fix/getrecentevents-query-params \
  --title "fix: pass limit/offset query params to /events in getRecentEvents" \
  --body "Fixes #6. Supersedes PR #11.

\`getRecentEvents\` built a query string from \`opts.limit\` / \`opts.offset\` but
passed only the bare \`/events\` URL to \`baseRequest\`, so the params were silently
ignored. Now passes \`/events\${query}\`.

Exports one per line to prevent future merge conflicts."

# ── PR replacing #12: add getAllianceInfo ─────────────────────────────────
git checkout -b feat/alliance-api origin/master
git am new-pr-branches/0003-feat-add-getAllianceInfo-for-GET-alliances-allianceI.patch
git push origin feat/alliance-api
gh pr create \
  --base master \
  --head feat/alliance-api \
  --title "feat: add getAllianceInfo for GET /alliances/{allianceId}" \
  --body "Fixes #7. Supersedes PR #12.

Adds \`getAllianceInfo(allianceId, cb)\` wrapping the
\`/alliances/{allianceId}\` gameinfo endpoint. Returns alliance name, tag,
founder, founded date, and list of member guilds.

Exports one per line to prevent future merge conflicts."

# ── PR replacing #13: add getPlayerKills / getPlayerDeaths ────────────────
git checkout -b feat/player-kills-deaths origin/master
git am new-pr-branches/0004-feat-add-getPlayerKills-and-getPlayerDeaths-endpoint.patch
git push origin feat/player-kills-deaths
gh pr create \
  --base master \
  --head feat/player-kills-deaths \
  --title "feat: add getPlayerKills and getPlayerDeaths endpoints" \
  --body "Fixes #8. Supersedes PR #13.

The gameinfo API exposes \`/players/{id}/kills\` and \`/players/{id}/deaths\`
which return full event-history lists, distinct from the existing ranked
\`getPlayerTopKills\` / \`getPlayerSoloKills\` endpoints. Both accept optional
\`limit\`, \`offset\`, and \`range\` query params.

Exports one per line to prevent future merge conflicts."

# ── Close old draft PRs ───────────────────────────────────────────────────
gh pr close 10 --comment "Superseded by conflict-free replacement PR."
gh pr close 11 --comment "Superseded by conflict-free replacement PR."
gh pr close 12 --comment "Superseded by conflict-free replacement PR."
gh pr close 13 --comment "Superseded by conflict-free replacement PR."
```
