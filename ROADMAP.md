# Claude Den Roadmap

## Current: v0.1.0 (2026-04-07)

MVP shipped. Core features working:
- Terminal detection + config generation (Ghostty, iTerm2, Kitty, Alacritty)
- 5 built-in themes
- Starship + tmux configuration
- Doctor diagnostics + backup/restore
- npm published, CI passing, GIF demo in README

---

## v0.2.0 — Polish & Reach (Target: April 14-20)

**Goal:** Make it easy for others to adopt and share.

- [ ] **#9 Promotion round 1** — Post X/Twitter, Reddit r/ClaudeAI, r/commandline
- [ ] **#9 Re-submit awesome-claude-code** (after April 13)
- [ ] **Post on Chinese communities** — V2EX, 掘金
- [ ] **npm link fix** — Add `postinstall` script or improve bin path
- [ ] **Better GIF** — Record with `den` command (after npm global install works)
- [ ] **Add `--dry-run` to init** — Show what would change without writing files
- [ ] **Improve error messages** — Better guidance when tools not installed

Release: `npm publish` as v0.2.0

---

## v0.3.0 — Custom Themes (Target: April 21-30)

**Goal:** Let users create and share their own themes.

- [ ] **#4 User theme directory** — Load themes from `~/.config/claude-den/themes/`
- [ ] **Theme file format** — JSON with same structure as built-in themes
- [ ] **`den theme create`** — Interactive theme builder (pick colors, preview live)
- [ ] **`den theme export`** — Export current config as a shareable theme
- [ ] **#5 Warp theme generator** — YAML format
- [ ] **#5 Windows Terminal generator** — JSON settings fragment
- [ ] **More built-in themes** — Rosé Pine, Kanagawa, Everforest, One Dark

Release: `npm publish` as v0.3.0

---

## v0.4.0 — Smart Upgrade (Target: May 1-10)

**Goal:** Non-destructive config updates.

- [ ] **#6 `den upgrade`** — Detect ccx-generated configs via header comment
- [ ] **Diff preview** — Show what would change before applying
- [ ] **Merge strategy** — Keep user customizations, update claude-den defaults
- [ ] **Config version tracking** — Know which version generated the current config

Release: `npm publish` as v0.4.0

---

## v1.0.0 — Multi-Agent Orchestration (Target: May-June)

**Goal:** The killer feature. Manage parallel Claude Code agents.

- [ ] **#7 `den agent spawn <count>`** — Launch N Claude agents in tmux panes
- [ ] **`den agent status`** — Real-time dashboard (token usage, task progress)
- [ ] **`den agent kill <id>`** — Stop individual agents
- [ ] **`den agent broadcast "msg"`** — Send message to all agents
- [ ] **Git worktree auto-creation** — Each agent gets its own worktree
- [ ] **Cost tracking** — Track token/cost per agent per session
- [ ] **Session persistence** — Resume agent sessions after restart

Release: `npm publish` as v1.0.0 — this is the "real" launch

---

## v2.0.0 — Community Theme Engine (Target: July+)

**Goal:** Build a community around terminal aesthetics.

- [ ] **#8 `den theme publish`** — Push theme to GitHub-based registry
- [ ] **`den theme search`** — Browse community themes
- [ ] **`den theme import <url>`** — Install from URL or registry
- [ ] **Preview gallery** — Web page showing all community themes
- [ ] **Star/rating system** — Community curation

---

## Growth Metrics to Track

| Metric | v0.1 (now) | v0.3 target | v1.0 target |
|--------|-----------|-------------|-------------|
| npm weekly downloads | 0 | 50 | 500 |
| GitHub stars | 0 | 20 | 200 |
| Built-in themes | 5 | 12 | 15 |
| Supported terminals | 4 | 6 | 6 |
| Contributors | 1 | 3 | 10 |
