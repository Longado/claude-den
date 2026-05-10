import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { platform } from "node:os";
import { join } from "node:path";
import type { TerminalInfo, TerminalType } from "../types.js";

const TERMINAL_ENV_CHECKS: ReadonlyArray<{
  readonly env: string;
  readonly value?: string;
  readonly type: TerminalType;
  readonly name: string;
}> = [
  { env: "GHOSTTY_RESOURCES_DIR", type: "ghostty", name: "Ghostty" },
  { env: "TERM_PROGRAM", value: "iTerm.app", type: "iterm2", name: "iTerm2" },
  { env: "TERM_PROGRAM", value: "WarpTerminal", type: "warp", name: "Warp" },
  { env: "KITTY_PID", type: "kitty", name: "Kitty" },
  { env: "ALACRITTY_LOG", type: "alacritty", name: "Alacritty" },
  {
    env: "TERM_PROGRAM",
    value: "Apple_Terminal",
    type: "terminal.app",
    name: "Terminal.app",
  },
  {
    env: "WT_SESSION",
    type: "windows-terminal",
    name: "Windows Terminal",
  },
];

const CONFIG_PATHS: Readonly<Record<TerminalType, string | null>> = {
  ghostty: "~/.config/ghostty/config",
  iterm2: "~/Library/Preferences/com.googlecode.iterm2.plist",
  kitty: "~/.config/kitty/kitty.conf",
  alacritty: "~/.config/alacritty/alacritty.toml",
  warp: "~/.warp/themes",
  "terminal.app": null,
  "windows-terminal": null,
  unknown: null,
};

function expandHome(filepath: string): string {
  const home = process.env.HOME ?? process.env.USERPROFILE ?? "";
  return filepath.replace(/^~/, home);
}

function getVersion(type: TerminalType): string | null {
  const versionEnvMap: Partial<Record<TerminalType, string>> = {
    iterm2: "TERM_PROGRAM_VERSION",
  };
  const envKey = versionEnvMap[type];
  return envKey ? (process.env[envKey] ?? null) : null;
}

function getConfigPath(type: TerminalType): string | null {
  const template = CONFIG_PATHS[type];
  if (!template) return null;

  const expanded = expandHome(template);
  return expanded;
}

export function detectTerminal(
  env: Record<string, string | undefined> = process.env,
): TerminalInfo {
  for (const check of TERMINAL_ENV_CHECKS) {
    const envValue = env[check.env];
    if (envValue === undefined) continue;
    if (check.value && envValue !== check.value) continue;

    return {
      type: check.type,
      name: check.name,
      version: getVersion(check.type),
      configPath: getConfigPath(check.type),
    };
  }

  return {
    type: "unknown",
    name: "Unknown Terminal",
    version: null,
    configPath: null,
  };
}

const MACOS_APP_PATHS: Partial<Record<TerminalType, string>> = {
  ghostty: "/Applications/Ghostty.app",
  iterm2: "/Applications/iTerm.app",
  warp: "/Applications/Warp.app",
  kitty: "/Applications/kitty.app",
  alacritty: "/Applications/Alacritty.app",
};

const POSIX_COMMANDS: Partial<Record<TerminalType, string>> = {
  ghostty: "ghostty",
  kitty: "kitty",
  alacritty: "alacritty",
  warp: "warp-terminal",
};

function commandExists(cmd: string): boolean {
  try {
    execFileSync("which", [cmd], { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

export function isTerminalInstalled(type: TerminalType): boolean {
  if (platform() === "darwin") {
    const appPath = MACOS_APP_PATHS[type];
    if (appPath && existsSync(appPath)) return true;
  }
  const cmd = POSIX_COMMANDS[type];
  if (!cmd) return false;
  return commandExists(cmd);
}

export function listInstalledTerminals(): ReadonlyArray<TerminalInfo> {
  const terminals: TerminalInfo[] = [];

  for (const check of TERMINAL_ENV_CHECKS) {
    if (
      check.type !== "terminal.app" &&
      check.type !== "windows-terminal" &&
      check.type !== "unknown"
    ) {
      if (isTerminalInstalled(check.type)) {
        terminals.push({
          type: check.type,
          name: check.name,
          version: null,
          configPath: getConfigPath(check.type),
        });
      }
    }
  }

  return terminals;
}
