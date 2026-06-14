import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";
import path from "node:path";

const applicationUrl = "http://127.0.0.1:15174";
const commandExtension = process.platform === "win32" ? ".cmd" : "";
const npmCommand = `npm${commandExtension}`;
const electronCommand = path.join(
  process.cwd(),
  "node_modules",
  ".bin",
  `electron${commandExtension}`
);

const webProcess = spawn(npmCommand, ["run", "dev"], {
  cwd: process.cwd(),
  shell: false,
  stdio: "inherit"
});

await waitForApplication(applicationUrl);

const desktopProcess = spawn(electronCommand, ["electron/main.cjs"], {
  cwd: process.cwd(),
  env: process.env,
  shell: false,
  stdio: "inherit"
});

desktopProcess.on("exit", (exitCode) => {
  webProcess.kill();
  process.exit(exitCode ?? 0);
});

process.on("SIGINT", () => {
  desktopProcess.kill();
  webProcess.kill();
});

async function waitForApplication(url) {
  const maximumAttempts = 80;

  for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return;
      }
    } catch {
      await wait(500);
    }
  }

  webProcess.kill();
  throw new Error(`Application did not become ready at ${url}.`);
}
