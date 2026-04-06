# claude-den

Your cozy terminal den for Claude Code.

One command to set up the perfect terminal environment for Claude Code development.

## Features

- **Auto-detect terminal** - Ghostty, iTerm2, Kitty, Alacritty, Warp, and more
- **5 built-in themes** - Catppuccin Mocha, Nord, Tokyo Night, Dracula, Gruvbox
- **Starship prompt** - Claude Code-aware status line with git integration
- **tmux layouts** - Predefined workflows: coding, parallel agents, monitoring
- **Backup & restore** - Never lose your existing configs
- **Doctor** - Diagnose your terminal setup

## Install

```bash
# Clone and install globally
git clone https://github.com/Longado/claude-den.git
cd claude-den
npm install && npm run build
npm link

# Now use it anywhere
den init
```

Or run directly without installing:

```bash
git clone https://github.com/Longado/claude-den.git
cd claude-den
npm install && npm run build
node dist/bin/den.js init
```

## Commands

| Command | Description |
|---------|-------------|
| `den init` | Interactive setup wizard |
| `den theme list` | Show available themes |
| `den theme preview <name>` | Preview a theme's colors |
| `den theme apply <name>` | Apply theme everywhere |
| `den layout list` | Show available tmux layouts |
| `den layout start <name>` | Launch a tmux layout |
| `den doctor` | Check terminal capabilities |
| `den backup` | Backup current configs |
| `den restore` | Restore from backup |

## Themes

| Theme | Description |
|-------|-------------|
| `catppuccin-mocha` | Soothing pastel with warm purple tones |
| `nord` | Arctic, north-bluish palette |
| `tokyo-night` | Clean dark, inspired by Tokyo city lights |
| `dracula` | Dark theme with vibrant colors |
| `gruvbox` | Retro groove with warm earthy tones |

## Layouts

| Layout | Description |
|--------|-------------|
| `coding` | Claude Code left, shell right |
| `parallel` | 2x2 grid for parallel Claude agents |
| `monitor` | Claude + git + system monitor |

## Supported Terminals

- Ghostty (recommended)
- iTerm2
- Kitty
- Alacritty
- Warp

## Prerequisites

- Node.js >= 18
- Recommended: [Maple Mono NF CN](https://github.com/subframe7536/maple-font) font
- Optional: [Starship](https://starship.rs), [tmux](https://github.com/tmux/tmux)

## Development

```bash
git clone https://github.com/Longado/claude-den.git
cd claude-den
npm install
npm test
npm run build
```

## Roadmap

- **Phase 2**: Multi-agent orchestration (`den agent spawn 3`)
- **Phase 3**: Community theme engine (`den theme publish`)

## License

MIT
