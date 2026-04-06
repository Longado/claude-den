import { platform, arch, homedir } from "node:os";
import { existsSync } from "node:fs";
import type { OSInfo, OSType } from "../types.js";

export function detectOS(
  env: Record<string, string | undefined> = process.env,
): OSInfo {
  const osType = resolveOSType(env);
  const shell = resolveShell(env);

  return {
    type: osType,
    arch: arch(),
    shell,
    homeDir: homedir(),
  };
}

function resolveOSType(
  env: Record<string, string | undefined>,
): OSType {
  const p = platform();

  if (p === "darwin") return "macos";
  if (p === "win32") return "windows";

  if (p === "linux") {
    const isWSL =
      env.WSL_DISTRO_NAME !== undefined ||
      env.WSLENV !== undefined ||
      existsSync("/proc/sys/fs/binfmt_misc/WSLInterop");
    return isWSL ? "wsl" : "linux";
  }

  return "linux";
}

function resolveShell(
  env: Record<string, string | undefined>,
): string {
  const shell = env.SHELL ?? env.ComSpec ?? "";
  if (shell.includes("zsh")) return "zsh";
  if (shell.includes("bash")) return "bash";
  if (shell.includes("fish")) return "fish";
  if (shell.includes("powershell") || shell.includes("pwsh")) return "powershell";
  return shell.split("/").pop() ?? "unknown";
}
