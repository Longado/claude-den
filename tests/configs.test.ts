import { describe, it, expect } from "vitest";
import { getThemeOrDefault } from "../src/themes/index.js";
import { generateGhosttyConfig } from "../src/configs/ghostty/config.js";
import { generateIterm2Profile } from "../src/configs/iterm2/profile.js";
import { generateKittyConfig } from "../src/configs/kitty/config.js";
import { generateAlacrittyConfig } from "../src/configs/alacritty/config.js";
import { generateStarshipConfig } from "../src/configs/starship/config.js";
import { generateTmuxConfig, generateTmuxLayoutScript, LAYOUTS } from "../src/configs/tmux/config.js";

const theme = getThemeOrDefault("catppuccin-mocha");

describe("generateGhosttyConfig", () => {
  const config = generateGhosttyConfig(theme);

  it("includes theme name in header", () => {
    expect(config).toContain("Catppuccin Mocha");
  });

  it("includes font family", () => {
    expect(config).toContain('font-family = "Maple Mono NF CN"');
  });

  it("includes background color", () => {
    expect(config).toContain(`background = ${theme.colors.background}`);
  });

  it("includes palette entries", () => {
    expect(config).toContain("palette = 0=");
    expect(config).toContain("palette = 15=");
  });

  it("includes opacity setting", () => {
    expect(config).toContain(`background-opacity = ${theme.appearance.backgroundOpacity}`);
  });

  it("includes Claude Code keybindings", () => {
    expect(config).toContain("keybind = cmd+d=new_split:right");
    expect(config).toContain("keybind = cmd+shift+enter=toggle_split_zoom");
  });

  it("includes scrollback limit", () => {
    expect(config).toContain("scrollback-limit = 25000000");
  });
});

describe("generateIterm2Profile", () => {
  const profileJson = generateIterm2Profile(theme);
  const profile = JSON.parse(profileJson);

  it("generates valid JSON", () => {
    expect(profile).toBeDefined();
  });

  it("includes profile name", () => {
    expect(profile.Name).toContain("Den");
    expect(profile.Name).toContain("Catppuccin Mocha");
  });

  it("includes background color components", () => {
    expect(profile["Background Color"]).toBeDefined();
    expect(profile["Background Color"]["Red Component"]).toBeTypeOf("number");
  });

  it("includes all 16 ANSI colors", () => {
    for (let i = 0; i <= 15; i++) {
      expect(profile[`Ansi ${i} Color`]).toBeDefined();
    }
  });

  it("sets cursor type", () => {
    expect(profile["Cursor Type"]).toBeDefined();
  });
});

describe("generateKittyConfig", () => {
  const config = generateKittyConfig(theme);

  it("includes theme name", () => {
    expect(config).toContain("Catppuccin Mocha");
  });

  it("includes font", () => {
    expect(config).toContain("Maple Mono NF CN");
  });

  it("includes color definitions", () => {
    expect(config).toContain("color0");
    expect(config).toContain("color15");
  });

  it("includes keybindings", () => {
    expect(config).toContain("map cmd+d");
  });
});

describe("generateAlacrittyConfig", () => {
  const config = generateAlacrittyConfig(theme);

  it("includes theme name", () => {
    expect(config).toContain("Catppuccin Mocha");
  });

  it("includes font family", () => {
    expect(config).toContain("Maple Mono NF CN");
  });

  it("includes color sections", () => {
    expect(config).toContain("[colors.primary]");
    expect(config).toContain("[colors.normal]");
    expect(config).toContain("[colors.bright]");
  });
});

describe("generateStarshipConfig", () => {
  const config = generateStarshipConfig(theme);

  it("includes theme name", () => {
    expect(config).toContain("Catppuccin Mocha");
  });

  it("includes format string", () => {
    expect(config).toContain("format = ");
  });

  it("includes git_branch module", () => {
    expect(config).toContain("[git_branch]");
  });

  it("includes character module", () => {
    expect(config).toContain("[character]");
  });

  it("uses theme colors in modules", () => {
    expect(config).toContain(theme.colors.green);
    expect(config).toContain(theme.colors.blue);
  });
});

describe("generateTmuxConfig", () => {
  const config = generateTmuxConfig(theme);

  it("includes theme name", () => {
    expect(config).toContain("Catppuccin Mocha");
  });

  it("includes truecolor settings", () => {
    expect(config).toContain("tmux-256color");
    expect(config).toContain("RGB");
  });

  it("includes mouse support", () => {
    expect(config).toContain("set -g mouse on");
  });

  it("includes status line with theme colors", () => {
    expect(config).toContain(theme.colors.blue);
  });

  it("includes pane splitting keybindings", () => {
    expect(config).toContain("split-window -h");
    expect(config).toContain("split-window -v");
  });
});

describe("tmux layouts", () => {
  it("has 3 predefined layouts", () => {
    expect(LAYOUTS.size).toBe(3);
  });

  it("has coding layout", () => {
    expect(LAYOUTS.has("coding")).toBe(true);
  });

  it("has parallel layout", () => {
    expect(LAYOUTS.has("parallel")).toBe(true);
  });

  it("has monitor layout", () => {
    expect(LAYOUTS.has("monitor")).toBe(true);
  });

  it("generates valid bash script for layout", () => {
    const layout = LAYOUTS.get("coding")!;
    const script = generateTmuxLayoutScript(layout);
    expect(script).toContain("#!/usr/bin/env bash");
    expect(script).toContain("tmux new-session");
    expect(script).toContain("tmux attach-session");
  });
});
