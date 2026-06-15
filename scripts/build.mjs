import { copyFile, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDirectory = join(projectRoot, "dist");
const staticFiles = ["index.html", "styles.css", "app.js"];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

await Promise.all(
  staticFiles.map(fileName =>
    copyFile(join(projectRoot, fileName), join(outputDirectory, fileName))
  )
);

console.log(`Built ${staticFiles.length} static files in dist/`);
