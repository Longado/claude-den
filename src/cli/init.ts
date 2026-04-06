import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import { detectTerminal, listInstalledTerminals } from "../detect/terminal.js";
import { detectCapabilities } from "../detect/capabilities.js";
import { detectOS } from "../detect/os.js";
import { listThemes, getThemeOrDefault } from "../themes/index.js";
import { generateGhosttyConfig } from "../configs/ghostty/config.js";
import { generateIterm2Profile } from "../configs/iterm2/profile.js";
import { generateKittyConfig } from "../configs/kitty/config.js";
import { generateAlacrittyConfig } from "../configs/alacritty/config.js";
import { generateStarshipConfig } from "../configs/starship/config.js";
import { generateTmuxConfig } from "../configs/tmux/config.js";
import { backupFile } from "./backup.js";
import type { TerminalType, Theme } from "../types.js";

const CONFIG_DESTINATIONS: Readonly<
  Partial<Record<TerminalType, (home: string) => string>>
> = {
  ghostty: (home) => join(home, ".config", "ghostty", "config"),
  kitty: (home) => join(home, ".config", "kitty", "kitty.conf"),
  alacritty: (home) => join(home, ".config", "alacritty", "alacritty.toml"),
};

const CONFIG_GENERATORS: Readonly<
  Partial<Record<TerminalType, (theme: Theme) => string>>
> = {
  ghostty: generateGhosttyConfig,
  iterm2: generateIterm2Profile,
  kitty: generateKittyConfig,
  alacritty: generateAlacrittyConfig,
};

function writeConfig(path: string, content: string): void {
  const dir = dirname(path);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(path, content, "utf-8");
}

export function registerInitCommand(program: Command): void {
  program
    .command("init")
    .description("Interactive setup wizard for Claude Code terminal experience")
    .option("-t, --theme <name>", "Theme name (skip theme selection)")
    .option("--no-starship", "Skip Starship configuration")
    .option("--no-tmux", "Skip tmux configuration")
    .action(async (options) => {
      console.log(
        chalk.bold.blue("\n  Claude Den\n"),
      );
      console.log(
        chalk.dim("  Your cozy terminal den for Claude Code\n"),
      );

      // Step 1: Detect environment
      const terminal = detectTerminal();
      const capabilities = detectCapabilities();
      const os = detectOS();

      console.log(chalk.green("  Detected environment:"));
      console.log(`    Terminal:  ${chalk.bold(terminal.name)}`);
      console.log(`    OS:        ${chalk.bold(os.type)} (${os.arch})`);
      console.log(`    Shell:     ${chalk.bold(os.shell)}`);
      console.log(
        `    TrueColor: ${capabilities.trueColor ? chalk.green("Yes") : chalk.yellow("No")}`,
      );
      console.log("");

      // Step 2: Choose terminal to configure
      const installed = listInstalledTerminals();
      const terminalChoices = [
        ...(terminal.type !== "unknown"
          ? [
              {
                name: `${terminal.name} (current)`,
                value: terminal.type,
              },
            ]
          : []),
        ...installed
          .filter((t) => t.type !== terminal.type)
          .map((t) => ({ name: t.name, value: t.type })),
      ];

      if (terminalChoices.length === 0) {
        terminalChoices.push({
          name: "Ghostty (recommended for Claude Code)",
          value: "ghostty" as TerminalType,
        });
      }

      const { selectedTerminal } = await inquirer.prompt([
        {
          type: "list",
          name: "selectedTerminal",
          message: "Which terminal do you want to configure?",
          choices: terminalChoices,
        },
      ]);

      // Step 3: Choose theme
      const themes = listThemes();
      let selectedTheme: Theme;

      if (options.theme) {
        selectedTheme = getThemeOrDefault(options.theme);
        console.log(`  Theme: ${chalk.bold(selectedTheme.displayName)}\n`);
      } else {
        const { themeName } = await inquirer.prompt([
          {
            type: "list",
            name: "themeName",
            message: "Choose a color theme:",
            choices: themes.map((t) => ({
              name: `${t.displayName} - ${chalk.dim(t.description)}`,
              value: t.name,
            })),
          },
        ]);
        selectedTheme = getThemeOrDefault(themeName);
      }

      // Step 4: Additional options
      const { setupStarship, setupTmux } = await inquirer.prompt([
        {
          type: "confirm",
          name: "setupStarship",
          message: "Setup Starship prompt with Claude Code theme?",
          default: options.starship !== false,
          when: () => options.starship !== false,
        },
        {
          type: "confirm",
          name: "setupTmux",
          message: "Setup tmux with Claude Code workflow keybindings?",
          default: options.tmux !== false,
          when: () => options.tmux !== false,
        },
      ]);

      // Step 5: Generate and install configs
      console.log(chalk.blue("\n  Installing configurations...\n"));
      const home = homedir();

      // Terminal config
      const generator = CONFIG_GENERATORS[selectedTerminal as TerminalType];
      if (generator) {
        const configContent = generator(selectedTheme);
        const getDestination = CONFIG_DESTINATIONS[selectedTerminal as TerminalType];

        if (getDestination) {
          const destPath = getDestination(home);
          if (existsSync(destPath)) {
            backupFile(destPath);
            console.log(chalk.dim(`    Backed up existing config`));
          }
          writeConfig(destPath, configContent);
          console.log(
            chalk.green(`  ✓ ${selectedTerminal} config → ${destPath}`),
          );
        } else if (selectedTerminal === "iterm2") {
          const profilePath = join(
            home,
            ".config",
            "claude-den",
            `iterm2-${selectedTheme.name}.json`,
          );
          writeConfig(profilePath, configContent);
          console.log(
            chalk.green(
              `  ✓ iTerm2 profile → ${profilePath}`,
            ),
          );
          console.log(
            chalk.dim(
              "    Import via iTerm2 → Settings → Profiles → Other Actions → Import JSON Profiles",
            ),
          );
        }
      }

      // Starship config
      if (setupStarship !== false) {
        const starshipPath = join(home, ".config", "starship.toml");
        if (existsSync(starshipPath)) {
          backupFile(starshipPath);
        }
        writeConfig(starshipPath, generateStarshipConfig(selectedTheme));
        console.log(chalk.green(`  ✓ Starship config → ${starshipPath}`));

        // Check if Starship init is in shell config
        const shellRcPath =
          os.shell === "zsh"
            ? join(home, ".zshrc")
            : os.shell === "bash"
              ? join(home, ".bashrc")
              : null;

        if (shellRcPath && existsSync(shellRcPath)) {
          const { readFileSync } = await import("node:fs");
          const rcContent = readFileSync(shellRcPath, "utf-8");
          if (!rcContent.includes("starship init")) {
            console.log(
              chalk.yellow(
                `\n  Note: Add this to your ${shellRcPath}:`,
              ),
            );
            console.log(
              chalk.dim(`    eval "$(starship init ${os.shell})"\n`),
            );
          }
        }
      }

      // tmux config
      if (setupTmux !== false) {
        const tmuxPath = join(home, ".tmux.conf");
        if (existsSync(tmuxPath)) {
          backupFile(tmuxPath);
        }
        writeConfig(tmuxPath, generateTmuxConfig(selectedTheme));
        console.log(chalk.green(`  ✓ tmux config → ${tmuxPath}`));
      }

      // Done
      console.log(chalk.bold.green("\n  Setup complete!\n"));
      console.log(chalk.dim("  Quick tips:"));
      console.log(chalk.dim("    • den theme <name>   Switch theme"));
      console.log(chalk.dim("    • den layout coding  Launch coding layout"));
      console.log(chalk.dim("    • den doctor         Check terminal setup"));
      console.log("");
    });
}
