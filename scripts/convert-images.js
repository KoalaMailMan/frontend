import path from "path";
import sharp from "sharp";
import { readdirSync, existsSync, mkdirSync } from "fs";

const sizes = [320, 640, 768, 1200, 1600];
const INPUT_DIR = path.resolve("static");
const OUTPUT_DIR = path.resolve("public/images/backgrounds");
console.log(INPUT_DIR);

mkdirSync(OUTPUT_DIR, { recursive: true });

const files = readdirSync(INPUT_DIR).filter(
  (f) => f.endsWith(".png") || f.endsWith(".jpg")
);

await Promise.all(
  files.flatMap((file) =>
    sizes.map((size) => {
      const name = file.replace(/\.(png|jpg)$/, "");
      const outputPath = path.join(OUTPUT_DIR, `${name}_${size}.webp`);

      if (existsSync(outputPath)) return Promise.resolve();

      return sharp(path.join(INPUT_DIR, file))
        .resize(size)
        .webp({ quality: 80 })
        .toFile(outputPath);
    })
  )
);
