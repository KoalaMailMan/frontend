import path from "path";
import fs from "fs";

function updateSitemap() {
  const sitemapPath = path.resolve("public", "sitemap.xml");

  if (!fs.existsSync(sitemapPath)) {
    console.error("sitemap.xml not found at:", sitemapPath);
    process.exit(1);
  }

  const today = new Date().toISOString().split("T")[0];

  let sitemap = fs.readFileSync(sitemapPath, "utf-8");

  const oldDateMatch = sitemap.match(/<lastmod>(.*?)<\/lastmod>/);
  const oldDate = oldDateMatch ? oldDateMatch[1] : "unknown";

  const updatedSitemap = sitemap.replace(
    /<lastmod>[\d-]+<\/lastmod>/g,
    `<lastmod>${today}</lastmod>`
  );

  if (sitemap === updatedSitemap) {
    console.log("Sitemap already up to date:", oldDate);
    return;
  }

  fs.writeFileSync(sitemapPath, updatedSitemap);

  console.log("Sitemap updated");
  console.log(`   ${oldDate} → ${today}`);
}

if (process.env.CI === "true") {
  updateSitemap();
} else {
  console.log("Skipping sitemap update (not in CI)");
  console.log("   Use CI=true npm run update-sitemap to force");
}

export { updateSitemap };
