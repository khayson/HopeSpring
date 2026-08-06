# Contributing to HopeSpring

## Branch strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code. **Never push directly.** |
| `develop` | Integration branch. PRs merge here first. |
| `feature/<name>` | New features (branch from `develop`). |
| `fix/<name>` | Bug fixes (branch from `develop`). |
| `hotfix/<name>` | Urgent production fixes (branch from `main`, merge back to both `main` and `develop`). |

## Workflow

1. Pull latest `develop`: `git pull origin develop`
2. Create your branch: `git checkout -b feature/your-feature`
3. Make changes, commit with clear messages
4. Push and open a PR against `develop`
5. Request review from at least one teammate
6. After approval and CI passes, merge via **squash merge**

## Before opening a PR

```bash
php artisan test --compact          # all tests pass
vendor/bin/pint --dirty             # code style fixed
npm run build                       # frontend builds cleanly
```

## Commit messages

Use present tense, imperative mood:
- `Add donation form validation`
- `Fix mobile nav overlay z-index`
- `Update programme card hover state`

## Code style

- **PHP**: Laravel Pint enforces style. Run `vendor/bin/pint --dirty` before committing.
- **TypeScript/React**: ESLint + Prettier. Run `npm run lint` if available.
- **CSS**: Tailwind utility classes. No arbitrary values in components — use design tokens.

## What NOT to commit

- `.env` files (use `.env.example` for new variables)
- Compiled assets (`public/build/` is gitignored)
- `vendor/` and `node_modules/`
- IDE-specific files (`.vscode/`, `.idea/`, etc. — already gitignored)
