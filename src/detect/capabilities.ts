import type { Capabilities } from "../types.js";

export function detectCapabilities(
  env: Record<string, string | undefined> = process.env,
): Capabilities {
  const colorTerm = env.COLORTERM ?? "";
  const term = env.TERM ?? "";
  const termProgram = env.TERM_PROGRAM ?? "";

  const trueColor =
    colorTerm === "truecolor" ||
    colorTerm === "24bit" ||
    term.includes("256color") ||
    termProgram === "iTerm.app" ||
    termProgram === "WarpTerminal" ||
    env.GHOSTTY_RESOURCES_DIR !== undefined;

  const color256 = trueColor || term.includes("256color") || term === "xterm";

  const unicode = (() => {
    const lang = env.LANG ?? "";
    const lcAll = env.LC_ALL ?? "";
    return (
      lang.includes("UTF-8") ||
      lang.includes("utf-8") ||
      lcAll.includes("UTF-8") ||
      lcAll.includes("utf-8")
    );
  })();

  const mouseSupport =
    env.GHOSTTY_RESOURCES_DIR !== undefined ||
    termProgram === "iTerm.app" ||
    env.KITTY_PID !== undefined;

  const hyperlinks =
    env.GHOSTTY_RESOURCES_DIR !== undefined ||
    termProgram === "iTerm.app" ||
    env.KITTY_PID !== undefined ||
    termProgram === "WarpTerminal";

  const sixel = env.KITTY_PID !== undefined;

  return {
    trueColor,
    color256,
    unicode,
    mouseSupport,
    hyperlinks,
    sixel,
  };
}
