import type { Theme } from "../../types.js";

function hexToRgbComponents(hex: string): {
  readonly r: number;
  readonly g: number;
  readonly b: number;
} {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.substring(0, 2), 16) / 255,
    g: parseInt(clean.substring(2, 4), 16) / 255,
    b: parseInt(clean.substring(4, 6), 16) / 255,
  };
}

function colorEntry(hex: string): Record<string, unknown> {
  const { r, g, b } = hexToRgbComponents(hex);
  return {
    "Red Component": r,
    "Green Component": g,
    "Blue Component": b,
    "Alpha Component": 1,
    "Color Space": "sRGB",
  };
}

export function generateIterm2Profile(theme: Theme): string {
  const { colors, appearance } = theme;

  const profile = {
    "Name": `Den ${theme.displayName}`,
    "Guid": `den-${theme.name}`,
    "Normal Font": "MapleMono-NF-CN-Regular 14",
    "Transparency": 1 - appearance.backgroundOpacity,
    "Blur": appearance.backgroundBlur > 0,
    "Blur Radius": appearance.backgroundBlur / 3,
    "Background Color": colorEntry(colors.background),
    "Foreground Color": colorEntry(colors.foreground),
    "Cursor Color": colorEntry(colors.cursor),
    "Selection Color": colorEntry(colors.selectionBackground),
    "Selected Text Color": colorEntry(colors.selectionForeground),
    "Ansi 0 Color": colorEntry(colors.black),
    "Ansi 1 Color": colorEntry(colors.red),
    "Ansi 2 Color": colorEntry(colors.green),
    "Ansi 3 Color": colorEntry(colors.yellow),
    "Ansi 4 Color": colorEntry(colors.blue),
    "Ansi 5 Color": colorEntry(colors.magenta),
    "Ansi 6 Color": colorEntry(colors.cyan),
    "Ansi 7 Color": colorEntry(colors.white),
    "Ansi 8 Color": colorEntry(colors.brightBlack),
    "Ansi 9 Color": colorEntry(colors.brightRed),
    "Ansi 10 Color": colorEntry(colors.brightGreen),
    "Ansi 11 Color": colorEntry(colors.brightYellow),
    "Ansi 12 Color": colorEntry(colors.brightBlue),
    "Ansi 13 Color": colorEntry(colors.brightMagenta),
    "Ansi 14 Color": colorEntry(colors.brightCyan),
    "Ansi 15 Color": colorEntry(colors.brightWhite),
    "Cursor Type": appearance.cursorStyle === "bar" ? 1 : appearance.cursorStyle === "underline" ? 2 : 0,
    "Blinking Cursor": appearance.cursorBlink,
    "Unlimited Scrollback": true,
    "Mouse Reporting": true,
    "Unicode Version": 9,
  };

  return JSON.stringify(profile, null, 2);
}
