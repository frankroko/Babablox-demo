import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve("public", "assets");
const OUTPUT_ROOT = path.resolve("public", "assets-optimized");
// Only process WebP assets in this project.
const IMAGE_EXTENSIONS = new Set([".webp"]);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return walk(fullPath);
      }
      return fullPath;
    })
  );
  return files.flat();
}

function formatBytes(bytes) {
  const units = ["B", "KB", "MB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value < 10 && unitIndex > 0 ? 2 : 1)} ${units[unitIndex]}`;
}

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!IMAGE_EXTENSIONS.has(ext)) return null;

  const before = await fs.stat(filePath);
  const pipeline = sharp(filePath).webp({ quality: 82, effort: 6 });

  const buffer = await pipeline.toBuffer();
  const relative = path.relative(ROOT, filePath);
  const parsed = path.parse(relative);
  const relativeWebp = path.join(parsed.dir, `${parsed.name}.webp`);
  const targetPath = path.join(OUTPUT_ROOT, relativeWebp);
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, buffer);

  const after = await fs.stat(targetPath);
  return {
    filePath: targetPath,
    relative: relativeWebp,
    before: before.size,
    after: after.size,
  };
}

async function main() {
  try {
    await fs.access(ROOT);
  } catch (error) {
    console.error(`Assets folder not found at ${ROOT}`);
    process.exitCode = 1;
    return;
  }

  await fs.mkdir(OUTPUT_ROOT, { recursive: true });

  const allFiles = await walk(ROOT);
  const imageFiles = allFiles.filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()));

  let totalBefore = 0;
  let totalAfter = 0;
  let optimized = 0;

  for (const file of imageFiles) {
    const result = await optimizeImage(file);
    if (!result) continue;
    optimized += 1;
    totalBefore += result.before;
    totalAfter += result.after;
    const delta = result.before - result.after;
    const sign = delta >= 0 ? "-" : "+";
    console.log(
      `${result.relative}: ${formatBytes(result.before)} -> ${formatBytes(
        result.after
      )} (${sign}${formatBytes(Math.abs(delta))})`
    );
  }

  const saved = totalBefore - totalAfter;
  const pct = totalBefore > 0 ? ((saved / totalBefore) * 100).toFixed(2) : "0.00";

  console.log("\nOptimization complete");
  console.log(`Files: ${optimized}`);
  console.log(`Total: ${formatBytes(totalBefore)} -> ${formatBytes(totalAfter)} (saved ${formatBytes(saved)} / ${pct}%)`);
  console.log(`Output: ${OUTPUT_ROOT}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
