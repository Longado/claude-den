import type { Theme } from "../types.js";
import { catppuccinMocha } from "./catppuccin-mocha.js";
import { nord } from "./nord.js";
import { tokyoNight } from "./tokyo-night.js";
import { dracula } from "./dracula.js";
import { gruvbox } from "./gruvbox.js";

const THEMES: ReadonlyMap<string, Theme> = new Map([
  [catppuccinMocha.name, catppuccinMocha],
  [nord.name, nord],
  [tokyoNight.name, tokyoNight],
  [dracula.name, dracula],
  [gruvbox.name, gruvbox],
]);

export const DEFAULT_THEME = "catppuccin-mocha";

export function getTheme(name: string): Theme | undefined {
  return THEMES.get(name);
}

export function listThemes(): ReadonlyArray<Theme> {
  return Array.from(THEMES.values());
}

export function getThemeOrDefault(name?: string): Theme {
  const theme = name ? THEMES.get(name) : undefined;
  return theme ?? THEMES.get(DEFAULT_THEME)!;
}
