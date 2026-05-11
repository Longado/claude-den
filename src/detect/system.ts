import { execFileSync } from "node:child_process";
import type { OSType } from "../types.js";

export function commandExists(cmd: string): boolean {
  try {
    execFileSync("which", [cmd], { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

const INSTALL_HINTS: Readonly<Record<string, Partial<Record<OSType, string>>>> = {
  starship: {
    macos: "brew install starship",
    linux: "curl -sS https://starship.rs/install.sh | sh",
    wsl: "curl -sS https://starship.rs/install.sh | sh",
    windows: "winget install --id Starship.Starship",
  },
  tmux: {
    macos: "brew install tmux",
    linux: "sudo apt install tmux  (or your distro's package manager)",
    wsl: "sudo apt install tmux  (or your distro's package manager)",
  },
  claude: {
    macos: "npm i -g @anthropic-ai/claude-code",
    linux: "npm i -g @anthropic-ai/claude-code",
    wsl: "npm i -g @anthropic-ai/claude-code",
    windows: "npm i -g @anthropic-ai/claude-code",
  },
};

export function installHint(pkg: string, osType: OSType): string {
  const hint = INSTALL_HINTS[pkg]?.[osType];
  return hint ?? `Install ${pkg} from your package manager`;
}
