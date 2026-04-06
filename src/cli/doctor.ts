import { Command } from "commander";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import chalk from "chalk";
import { detectTerminal } from "../detect/terminal.js";
import { detectCapabilities } from "../detect/capabilities.js";
import { detectOS } from "../detect/os.js";

interface CheckResult {
  readonly name: string;
  readonly status: "ok" | "warn" | "fail";
  readonly message: string;
}

function check(
  name: string,
  test: () => { status: "ok" | "warn" | "fail"; message: string },
): CheckResult {
  try {
    const result = test();
    return { name, ...result };
  } catch {
    return { name, status: "fail", message: "Check failed" };
  }
}

const ALLOWED_COMMANDS = new Set(["claude", "starship", "tmux", "git"]);

function commandExists(cmd: string): boolean {
  if (!ALLOWED_COMMANDS.has(cmd)) return false;
  try {
    execFileSync("which", [cmd], { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

function formatCheck(result: CheckResult): string {
  const icon =
    result.status === "ok"
      ? chalk.green("✓")
      : result.status === "warn"
        ? chalk.yellow("!")
        : chalk.red("✗");

  return `  ${icon} ${result.name.padEnd(25)} ${chalk.dim(result.message)}`;
}

export function registerDoctorCommand(program: Command): void {
  program
    .command("doctor")
    .description("Diagnose your terminal setup for Claude Code")
    .action(() => {
      console.log(chalk.bold.blue("\n  Claude Den Doctor\n"));

      const home = homedir();
      const terminal = detectTerminal();
      const capabilities = detectCapabilities();
      const os = detectOS();

      const checks: ReadonlyArray<CheckResult> = [
        // Terminal
        check("Terminal", () =>
          terminal.type !== "unknown"
            ? { status: "ok", message: `${terminal.name} detected` }
            : { status: "warn", message: "Unknown terminal" },
        ),

        // TrueColor
        check("TrueColor support", () =>
          capabilities.trueColor
            ? { status: "ok", message: "24-bit color supported" }
            : { status: "warn", message: "Limited to 256 colors" },
        ),

        // Unicode
        check("Unicode support", () =>
          capabilities.unicode
            ? { status: "ok", message: "UTF-8 enabled" }
            : { status: "warn", message: "UTF-8 not detected in locale" },
        ),

        // Claude Code
        check("Claude Code", () =>
          commandExists("claude")
            ? { status: "ok", message: "Installed" }
            : { status: "fail", message: "Not found. Install: npm i -g @anthropic-ai/claude-code" },
        ),

        // Starship
        check("Starship", () => {
          if (!commandExists("starship")) {
            return { status: "warn", message: "Not installed. Install: brew install starship" };
          }
          const configPath = join(home, ".config", "starship.toml");
          return existsSync(configPath)
            ? { status: "ok", message: "Installed and configured" }
            : { status: "warn", message: "Installed but no config found" };
        }),

        // tmux
        check("tmux", () =>
          commandExists("tmux")
            ? { status: "ok", message: "Installed" }
            : { status: "warn", message: "Not installed. Install: brew install tmux" },
        ),

        // Font
        check("Maple Mono NF CN", () => {
          const fontPaths = [
            join(home, "Library", "Fonts"),
            "/Library/Fonts",
            "/System/Library/Fonts",
          ];
          for (const fontPath of fontPaths) {
            try {
              const files = readdirSync(fontPath) as string[];
              if (files.some((f: string) => f.includes("MapleMono"))) {
                return { status: "ok", message: "Font installed" };
              }
            } catch {
              // Directory doesn't exist or not readable
            }
          }
          return {
            status: "warn",
            message: "Font not found. Install: brew install --cask font-maple-mono-nf-cn",
          };
        }),

        // Shell
        check("Shell", () => ({
          status: "ok",
          message: `${os.shell} on ${os.type} (${os.arch})`,
        })),

        // Git
        check("Git", () =>
          commandExists("git")
            ? { status: "ok", message: "Installed" }
            : { status: "fail", message: "Not found" },
        ),
      ];

      for (const result of checks) {
        console.log(formatCheck(result));
      }

      const failCount = checks.filter((c) => c.status === "fail").length;
      const warnCount = checks.filter((c) => c.status === "warn").length;

      console.log("");
      if (failCount > 0) {
        console.log(
          chalk.red(
            `  ${failCount} issue(s) need fixing. Run den init to setup.\n`,
          ),
        );
      } else if (warnCount > 0) {
        console.log(
          chalk.yellow(
            `  ${warnCount} suggestion(s). Run den init to improve your setup.\n`,
          ),
        );
      } else {
        console.log(
          chalk.green("  Everything looks great! Happy coding with Claude.\n"),
        );
      }
    });
}
