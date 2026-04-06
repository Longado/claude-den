import { Command } from "commander";
import { execSync, execFileSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import chalk from "chalk";
import { LAYOUTS, generateTmuxLayoutScript } from "../configs/tmux/config.js";

export function registerLayoutCommand(program: Command): void {
  const layoutCmd = program
    .command("layout")
    .description("Launch tmux layouts for Claude Code workflows");

  layoutCmd
    .command("list")
    .description("List available layouts")
    .action(() => {
      console.log(chalk.bold.blue("\n  Available Layouts\n"));

      for (const [name, layout] of LAYOUTS) {
        console.log(
          `  ${chalk.bold(name.padEnd(15))} ${chalk.dim(layout.description)}`,
        );
        console.log(
          chalk.dim(
            `  ${"".padEnd(15)} ${layout.panes.length} panes`,
          ),
        );
      }
      console.log("");
    });

  layoutCmd
    .command("start <name>")
    .description("Start a tmux layout")
    .action((name: string) => {
      const layout = LAYOUTS.get(name);
      if (!layout) {
        console.log(chalk.red(`  Layout "${name}" not found.`));
        console.log(
          chalk.dim("  Run `den layout list` to see available layouts.\n"),
        );
        return;
      }

      // Check if tmux is installed
      try {
        execFileSync("which", ["tmux"], { stdio: "pipe" });
      } catch {
        console.log(
          chalk.red("  tmux is not installed. Install with: brew install tmux\n"),
        );
        return;
      }

      const script = generateTmuxLayoutScript(layout);
      console.log(
        chalk.blue(
          `\n  Launching layout: ${chalk.bold(layout.name)}\n`,
        ),
      );

      // Write to temp file to avoid shell injection
      const scriptPath = join(tmpdir(), `claude-den-layout-${Date.now()}.sh`);
      try {
        writeFileSync(scriptPath, script, { mode: 0o755 });
        execSync(`bash "${scriptPath}"`, { stdio: "inherit" });
      } catch {
        // tmux attach exits with error when detaching, which is normal
      } finally {
        try { unlinkSync(scriptPath); } catch { /* cleanup best-effort */ }
      }
    });
}
