import { describe, it, expect } from "vitest";
import { detectTerminal } from "../src/detect/terminal.js";
import { detectCapabilities } from "../src/detect/capabilities.js";
import { detectOS } from "../src/detect/os.js";

describe("detectTerminal", () => {
  it("detects Ghostty from GHOSTTY_RESOURCES_DIR", () => {
    const result = detectTerminal({ GHOSTTY_RESOURCES_DIR: "/usr/share/ghostty" });
    expect(result.type).toBe("ghostty");
    expect(result.name).toBe("Ghostty");
  });

  it("detects iTerm2 from TERM_PROGRAM", () => {
    const result = detectTerminal({ TERM_PROGRAM: "iTerm.app" });
    expect(result.type).toBe("iterm2");
    expect(result.name).toBe("iTerm2");
  });

  it("detects Warp from TERM_PROGRAM", () => {
    const result = detectTerminal({ TERM_PROGRAM: "WarpTerminal" });
    expect(result.type).toBe("warp");
    expect(result.name).toBe("Warp");
  });

  it("detects Kitty from KITTY_PID", () => {
    const result = detectTerminal({ KITTY_PID: "12345" });
    expect(result.type).toBe("kitty");
    expect(result.name).toBe("Kitty");
  });

  it("detects Alacritty from ALACRITTY_LOG", () => {
    const result = detectTerminal({ ALACRITTY_LOG: "/tmp/alacritty.log" });
    expect(result.type).toBe("alacritty");
    expect(result.name).toBe("Alacritty");
  });

  it("detects Terminal.app from TERM_PROGRAM", () => {
    const result = detectTerminal({ TERM_PROGRAM: "Apple_Terminal" });
    expect(result.type).toBe("terminal.app");
    expect(result.name).toBe("Terminal.app");
  });

  it("detects Windows Terminal from WT_SESSION", () => {
    const result = detectTerminal({ WT_SESSION: "abc-123" });
    expect(result.type).toBe("windows-terminal");
    expect(result.name).toBe("Windows Terminal");
  });

  it("returns unknown for empty env", () => {
    const result = detectTerminal({});
    expect(result.type).toBe("unknown");
    expect(result.name).toBe("Unknown Terminal");
  });

  it("prioritizes Ghostty over TERM_PROGRAM", () => {
    const result = detectTerminal({
      GHOSTTY_RESOURCES_DIR: "/usr/share/ghostty",
      TERM_PROGRAM: "iTerm.app",
    });
    expect(result.type).toBe("ghostty");
  });

  it("provides config path for Ghostty", () => {
    const result = detectTerminal({ GHOSTTY_RESOURCES_DIR: "/usr/share/ghostty" });
    expect(result.configPath).toContain("ghostty/config");
  });
});

describe("detectCapabilities", () => {
  it("detects truecolor from COLORTERM", () => {
    const result = detectCapabilities({ COLORTERM: "truecolor" });
    expect(result.trueColor).toBe(true);
    expect(result.color256).toBe(true);
  });

  it("detects truecolor from 24bit", () => {
    const result = detectCapabilities({ COLORTERM: "24bit" });
    expect(result.trueColor).toBe(true);
  });

  it("detects 256 color from TERM", () => {
    const result = detectCapabilities({ TERM: "xterm-256color" });
    expect(result.trueColor).toBe(true);
    expect(result.color256).toBe(true);
  });

  it("detects unicode from LANG", () => {
    const result = detectCapabilities({ LANG: "en_US.UTF-8" });
    expect(result.unicode).toBe(true);
  });

  it("detects no unicode from missing locale", () => {
    const result = detectCapabilities({});
    expect(result.unicode).toBe(false);
  });

  it("detects mouse support for Ghostty", () => {
    const result = detectCapabilities({ GHOSTTY_RESOURCES_DIR: "/usr/share/ghostty" });
    expect(result.mouseSupport).toBe(true);
  });

  it("detects hyperlinks for iTerm2", () => {
    const result = detectCapabilities({ TERM_PROGRAM: "iTerm.app" });
    expect(result.hyperlinks).toBe(true);
  });

  it("returns minimal capabilities for empty env", () => {
    const result = detectCapabilities({});
    expect(result.trueColor).toBe(false);
    expect(result.color256).toBe(false);
    expect(result.unicode).toBe(false);
    expect(result.mouseSupport).toBe(false);
    expect(result.hyperlinks).toBe(false);
    expect(result.sixel).toBe(false);
  });
});

describe("detectOS", () => {
  it("returns valid OS info", () => {
    const result = detectOS();
    expect(result.type).toBeDefined();
    expect(result.arch).toBeDefined();
    expect(result.shell).toBeDefined();
    expect(result.homeDir).toBeDefined();
  });

  it("detects zsh shell", () => {
    const result = detectOS({ SHELL: "/bin/zsh" });
    expect(result.shell).toBe("zsh");
  });

  it("detects bash shell", () => {
    const result = detectOS({ SHELL: "/bin/bash" });
    expect(result.shell).toBe("bash");
  });

  it("detects fish shell", () => {
    const result = detectOS({ SHELL: "/usr/bin/fish" });
    expect(result.shell).toBe("fish");
  });
});
