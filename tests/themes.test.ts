import { describe, it, expect } from "vitest";
import { getTheme, listThemes, getThemeOrDefault } from "../src/themes/index.js";

describe("themes", () => {
  it("lists all 5 built-in themes", () => {
    const themes = listThemes();
    expect(themes).toHaveLength(5);
  });

  it("gets catppuccin-mocha by name", () => {
    const theme = getTheme("catppuccin-mocha");
    expect(theme).toBeDefined();
    expect(theme!.displayName).toBe("Catppuccin Mocha");
    expect(theme!.variant).toBe("dark");
  });

  it("gets nord by name", () => {
    const theme = getTheme("nord");
    expect(theme).toBeDefined();
    expect(theme!.displayName).toBe("Nord");
  });

  it("gets tokyo-night by name", () => {
    const theme = getTheme("tokyo-night");
    expect(theme).toBeDefined();
    expect(theme!.displayName).toBe("Tokyo Night");
  });

  it("gets dracula by name", () => {
    const theme = getTheme("dracula");
    expect(theme).toBeDefined();
    expect(theme!.displayName).toBe("Dracula");
  });

  it("gets gruvbox by name", () => {
    const theme = getTheme("gruvbox");
    expect(theme).toBeDefined();
    expect(theme!.displayName).toBe("Gruvbox Dark");
  });

  it("returns undefined for unknown theme", () => {
    const theme = getTheme("nonexistent");
    expect(theme).toBeUndefined();
  });

  it("getThemeOrDefault returns default for unknown name", () => {
    const theme = getThemeOrDefault("nonexistent");
    expect(theme.name).toBe("catppuccin-mocha");
  });

  it("getThemeOrDefault returns default for undefined", () => {
    const theme = getThemeOrDefault();
    expect(theme.name).toBe("catppuccin-mocha");
  });

  it("all themes have valid hex colors", () => {
    const hexRegex = /^#[0-9a-fA-F]{6}$/;
    const themes = listThemes();

    for (const theme of themes) {
      const { colors } = theme;
      expect(colors.background).toMatch(hexRegex);
      expect(colors.foreground).toMatch(hexRegex);
      expect(colors.cursor).toMatch(hexRegex);
      expect(colors.red).toMatch(hexRegex);
      expect(colors.green).toMatch(hexRegex);
      expect(colors.blue).toMatch(hexRegex);
    }
  });

  it("all themes have valid appearance settings", () => {
    const themes = listThemes();

    for (const theme of themes) {
      expect(theme.appearance.backgroundOpacity).toBeGreaterThan(0);
      expect(theme.appearance.backgroundOpacity).toBeLessThanOrEqual(1);
      expect(["bar", "block", "underline"]).toContain(theme.appearance.cursorStyle);
    }
  });
});
