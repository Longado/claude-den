import { Command } from "commander";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join, basename, dirname } from "node:path";
import { homedir } from "node:os";
import chalk from "chalk";
import type { BackupManifest } from "../types.js";

const BACKUP_DIR = join(homedir(), ".config", "claude-den", "backups");

function ensureBackupDir(): void {
  if (!existsSync(BACKUP_DIR)) {
    mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

function getManifestPath(): string {
  return join(BACKUP_DIR, "manifest.json");
}

function readManifest(): BackupManifest | null {
  const manifestPath = getManifestPath();
  if (!existsSync(manifestPath)) return null;
  const raw = readFileSync(manifestPath, "utf-8");
  return JSON.parse(raw) as BackupManifest;
}

function writeManifest(manifest: BackupManifest): void {
  ensureBackupDir();
  writeFileSync(getManifestPath(), JSON.stringify(manifest, null, 2), "utf-8");
}

export function backupFile(sourcePath: string): string {
  ensureBackupDir();

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupName = `${basename(sourcePath)}.${timestamp}.bak`;
  const backupPath = join(BACKUP_DIR, backupName);

  copyFileSync(sourcePath, backupPath);

  // Update manifest
  const manifest = readManifest() ?? {
    timestamp: new Date().toISOString(),
    files: [],
  };

  const updatedManifest: BackupManifest = {
    timestamp: new Date().toISOString(),
    files: [
      ...manifest.files,
      { source: sourcePath, backup: backupPath },
    ],
  };

  writeManifest(updatedManifest);

  return backupPath;
}

export function registerBackupCommand(program: Command): void {
  program
    .command("backup")
    .description("Backup current terminal configurations")
    .action(() => {
      console.log(chalk.bold.blue("\n  Claude Den Backup\n"));

      const home = homedir();
      const configFiles = [
        join(home, ".config", "ghostty", "config"),
        join(home, ".config", "kitty", "kitty.conf"),
        join(home, ".config", "alacritty", "alacritty.toml"),
        join(home, ".config", "starship.toml"),
        join(home, ".tmux.conf"),
      ];

      let backupCount = 0;
      for (const file of configFiles) {
        if (existsSync(file)) {
          const backupPath = backupFile(file);
          console.log(chalk.green(`  ✓ ${file}`));
          console.log(chalk.dim(`    → ${backupPath}`));
          backupCount++;
        }
      }

      if (backupCount === 0) {
        console.log(chalk.dim("  No config files found to backup.\n"));
      } else {
        console.log(
          chalk.green(`\n  Backed up ${backupCount} file(s) to ${BACKUP_DIR}\n`),
        );
      }
    });
}

export function registerRestoreCommand(program: Command): void {
  program
    .command("restore")
    .description("Restore terminal configurations from backup")
    .action(() => {
      console.log(chalk.bold.blue("\n  Claude Den Restore\n"));

      const manifest = readManifest();
      if (!manifest || manifest.files.length === 0) {
        console.log(chalk.dim("  No backups found.\n"));
        return;
      }

      console.log(
        chalk.dim(`  Backup from: ${manifest.timestamp}\n`),
      );

      let restoreCount = 0;
      for (const entry of manifest.files) {
        if (existsSync(entry.backup)) {
          const dir = dirname(entry.source);
          if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
          }
          copyFileSync(entry.backup, entry.source);
          console.log(chalk.green(`  ✓ Restored ${entry.source}`));
          restoreCount++;
        } else {
          console.log(
            chalk.yellow(`  ! Backup missing: ${entry.backup}`),
          );
        }
      }

      console.log(
        chalk.green(`\n  Restored ${restoreCount} file(s).\n`),
      );
    });
}
