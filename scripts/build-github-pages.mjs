import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { generateStaticWorldCupFeed } from "./generate-static-world-cup-feed.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

process.env.WORLD_CUP_DESK_STATIC_EXPORT = "1";
process.env.NEXT_PUBLIC_WORLD_CUP_DESK_STATIC_EXPORT = "1";
process.env.WORLD_CUP_DESK_SITE_BASE_PATH = "/World-Cup-Desk";
process.env.NEXT_PUBLIC_SITE_URL ??= "https://kazimlik81-lab.github.io/World-Cup-Desk";

await generateStaticWorldCupFeed(projectRoot);

const nextCliPath = path.join(projectRoot, "node_modules", "next", "dist", "bin", "next");
const buildResult = spawnSync(process.execPath, [nextCliPath, "build"], {
  cwd: projectRoot,
  env: process.env,
  shell: false,
  stdio: "inherit"
});

if (buildResult.error) {
  console.error(buildResult.error);
}

process.exit(buildResult.status ?? 1);
