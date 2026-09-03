# Production deploy

- Recurring production updates use `scripts/remote-deploy.sh` (manual SSH).
- Never run `db:seed` (or image seed download) on production updates — only `migrate --force`.
- First-time bootstrap remains `deploy.sh` (domain, DB, initial `.env`). Set `DB_PASS` in the environment before running it; never commit database passwords.
- Manual update from your machine: `ssh root@gekymedia.com 'bash -s' < scripts/remote-deploy.sh`
- Or on the server: `cd /home/gekymedia/web/hopespringfoundation.gekymedia.com/public_html && bash scripts/remote-deploy.sh` (after `git pull` once the script is on the server).
- `scripts/remote-deploy.sh` puts the app in maintenance mode during migrate/optimize and restores it even if a step fails.
