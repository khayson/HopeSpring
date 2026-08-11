# Vite dev server

Glob: `vite.config.ts`

## Watcher must exclude `vendor/`, `storage/`, and the SQLite database file

Vite's default file watcher only ignores `node_modules/` and `.git/`. In this
project the SQLite database lives at the project root (`hope-spring-foundation`,
set via `DB_DATABASE` in `.env`) instead of the conventional `database/` path.

Without explicit `server.watch.ignored` entries, every request that writes to
the database (i.e. almost every request) registers as a "file change" to
Vite's watcher, alongside the large `vendor/` tree and `storage/logs/*.log`
writes. Under enough load this stalls the dev server's event loop long enough
to drop the HMR WebSocket, which triggers Vite's built-in reload-on-reconnect
behavior — producing what looks like an infinite page reload loop with no
relation to Inertia, SSR, or React.

`vite.config.ts` must keep a `server.watch.ignored` list covering at least:
`vendor/**`, `storage/**`, `bootstrap/cache/**`, stale `public/build*` output,
and the SQLite db file itself (`hope-spring-foundation*`).

If the SQLite database is ever moved to the conventional `database/database.sqlite`
path, this rule's file-specific ignore pattern should be updated to match.
