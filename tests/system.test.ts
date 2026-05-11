import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { commandExists, installHint } from "../src/detect/system.js";
import { applyConfig } from "../src/cli/init.js";

describe("installHint", () => {
  it("returns brew command for starship on macOS", () => {
    expect(installHint("starship", "macos")).toContain("brew install starship");
  });

  it("returns curl install for starship on linux", () => {
    expect(installHint("starship", "linux")).toContain("starship.rs/install.sh");
  });

  it("returns apt for tmux on linux", () => {
    expect(installHint("tmux", "linux")).toContain("apt install tmux");
  });

  it("returns brew for tmux on macOS", () => {
    expect(installHint("tmux", "macos")).toBe("brew install tmux");
  });

  it("returns npm install for claude on every OS", () => {
    for (const os of ["macos", "linux", "wsl", "windows"] as const) {
      expect(installHint("claude", os)).toContain("@anthropic-ai/claude-code");
    }
  });

  it("falls back to a generic message for unknown packages", () => {
    expect(installHint("nonexistent-tool", "linux")).toContain("nonexistent-tool");
  });
});

describe("commandExists", () => {
  it("returns true for a command that exists (sh)", () => {
    expect(commandExists("sh")).toBe(true);
  });

  it("returns false for a command that does not exist", () => {
    expect(commandExists("definitely-not-a-real-command-xyz")).toBe(false);
  });
});

describe("applyConfig dry-run", () => {
  let workDir: string;

  beforeEach(() => {
    workDir = mkdtempSync(join(tmpdir(), "claude-den-test-"));
  });

  afterEach(() => {
    rmSync(workDir, { recursive: true, force: true });
  });

  it("does not write the file in dry-run mode", () => {
    const dest = join(workDir, "subdir", "config");
    applyConfig(dest, "hello", "test", true);
    expect(existsSync(dest)).toBe(false);
  });

  it("writes the file when dry-run is false", () => {
    const dest = join(workDir, "subdir", "config");
    applyConfig(dest, "hello", "test", false);
    expect(existsSync(dest)).toBe(true);
  });
});
