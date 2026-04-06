import { Command } from "commander";
import { registerInitCommand } from "./init.js";
import { registerThemeCommand } from "./theme.js";
import { registerLayoutCommand } from "./layout.js";
import { registerDoctorCommand } from "./doctor.js";
import { registerBackupCommand, registerRestoreCommand } from "./backup.js";

export function createProgram(): Command {
  const program = new Command();

  program
    .name("den")
    .description("Your cozy terminal den for Claude Code")
    .version("0.1.0");

  registerInitCommand(program);
  registerThemeCommand(program);
  registerLayoutCommand(program);
  registerDoctorCommand(program);
  registerBackupCommand(program);
  registerRestoreCommand(program);

  return program;
}
