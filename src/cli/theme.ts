import { Command } from "commander";
import chalk from "chalk";
import { listThemes, getTheme } from "../themes/index.js";
import type { Theme } from "../types.js";

function renderThemePreview(theme: Theme): void {
  const { colors } = theme;

  console.log(chalk.bold(`\n  ${theme.displayName}`));
  console.log(chalk.dim(`  ${theme.description} (by ${theme.author})\n`));

  // Color swatches
  const normalColors = [
    ["black", colors.black],
    ["red", colors.red],
    ["green", colors.green],
    ["yellow", colors.yellow],
    ["blue", colors.blue],
    ["magenta", colors.magenta],
    ["cyan", colors.cyan],
    ["white", colors.white],
  ] as const;

  const brightColors = [
    ["brBlack", colors.brightBlack],
    ["brRed", colors.brightRed],
    ["brGreen", colors.brightGreen],
    ["brYellow", colors.brightYellow],
    ["brBlue", colors.brightBlue],
    ["brMagenta", colors.brightMagenta],
    ["brCyan", colors.brightCyan],
    ["brWhite", colors.brightWhite],
  ] as const;

  const swatch = (hex: string) => chalk.bgHex(hex)("   ");

  console.log(
    "  Normal: " + normalColors.map(([, c]) => swatch(c)).join(" "),
  );
  console.log(
    "  Bright: " + brightColors.map(([, c]) => swatch(c)).join(" "),
  );
  console.log(
    `\n  BG: ${chalk.bgHex(colors.background)("       ")}  FG: ${chalk.hex(colors.foreground)("Hello Claude")}`,
  );
  console.log("");
}

export function registerThemeCommand(program: Command): void {
  const themeCmd = program
    .command("theme")
    .description("Manage terminal themes");

  themeCmd
    .command("list")
    .description("List all available themes")
    .action(() => {
      const themes = listThemes();
      console.log(chalk.bold.blue("\n  Available Themes\n"));

      for (const theme of themes) {
        const colorDots = [
          theme.colors.red,
          theme.colors.green,
          theme.colors.blue,
          theme.colors.magenta,
          theme.colors.cyan,
        ]
          .map((c) => chalk.hex(c)("●"))
          .join(" ");

        console.log(
          `  ${chalk.bold(theme.name.padEnd(20))} ${colorDots}  ${chalk.dim(theme.description)}`,
        );
      }
      console.log("");
    });

  themeCmd
    .command("preview <name>")
    .description("Preview a theme's colors")
    .action((name: string) => {
      const theme = getTheme(name);
      if (!theme) {
        console.log(chalk.red(`  Theme "${name}" not found.`));
        console.log(
          chalk.dim("  Run `den theme list` to see available themes.\n"),
        );
        return;
      }
      renderThemePreview(theme);
    });

  themeCmd
    .command("apply <name>")
    .description("Apply theme to all configured terminals")
    .action(async (name: string) => {
      const theme = getTheme(name);
      if (!theme) {
        console.log(chalk.red(`  Theme "${name}" not found.\n`));
        return;
      }

      console.log(
        chalk.blue(`\n  Applying theme: ${chalk.bold(theme.displayName)}\n`),
      );
      console.log(
        chalk.dim(`  Run \`den init --theme ${name}\` to apply to specific terminals.\n`),
      );
    });
}
