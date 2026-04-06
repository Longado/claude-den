export interface ThemeColors {
  readonly background: string;
  readonly foreground: string;
  readonly cursor: string;
  readonly selectionBackground: string;
  readonly selectionForeground: string;

  // ANSI 16 colors
  readonly black: string;
  readonly red: string;
  readonly green: string;
  readonly yellow: string;
  readonly blue: string;
  readonly magenta: string;
  readonly cyan: string;
  readonly white: string;
  readonly brightBlack: string;
  readonly brightRed: string;
  readonly brightGreen: string;
  readonly brightYellow: string;
  readonly brightBlue: string;
  readonly brightMagenta: string;
  readonly brightCyan: string;
  readonly brightWhite: string;
}

export interface ThemeAppearance {
  readonly backgroundOpacity: number;
  readonly backgroundBlur: number;
  readonly cursorStyle: "bar" | "block" | "underline";
  readonly cursorBlink: boolean;
}

export interface Theme {
  readonly name: string;
  readonly displayName: string;
  readonly description: string;
  readonly author: string;
  readonly variant: "dark" | "light";
  readonly colors: ThemeColors;
  readonly appearance: ThemeAppearance;
}

export type TerminalType =
  | "ghostty"
  | "iterm2"
  | "kitty"
  | "alacritty"
  | "warp"
  | "terminal.app"
  | "windows-terminal"
  | "unknown";

export interface TerminalInfo {
  readonly type: TerminalType;
  readonly name: string;
  readonly version: string | null;
  readonly configPath: string | null;
}

export interface Capabilities {
  readonly trueColor: boolean;
  readonly color256: boolean;
  readonly unicode: boolean;
  readonly mouseSupport: boolean;
  readonly hyperlinks: boolean;
  readonly sixel: boolean;
}

export type OSType = "macos" | "linux" | "wsl" | "windows";

export interface OSInfo {
  readonly type: OSType;
  readonly arch: string;
  readonly shell: string;
  readonly homeDir: string;
}

export interface BackupManifest {
  readonly timestamp: string;
  readonly files: ReadonlyArray<{
    readonly source: string;
    readonly backup: string;
  }>;
}

export interface TmuxLayout {
  readonly name: string;
  readonly description: string;
  readonly panes: ReadonlyArray<{
    readonly command: string;
    readonly split: "horizontal" | "vertical";
    readonly size?: string;
  }>;
}
