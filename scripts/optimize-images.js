import path from "path";
import sharp from "sharp";

const logoSizes = [576, 940];
const logoPath = path.resolve(
  process.cwd(),
  "src/assets/common/koala_mailman_text_logo.png"
);
const OUTPUT_DIR = path.resolve("public/images");

await Promise.all(
  logoSizes.map((size) =>
    sharp(logoPath)
      .resize(size)
      .webp({ quality: 70 })
      .toFile(path.join(OUTPUT_DIR, `koala_mailman_text_logo_${size}.webp`))
  )
);
