const fs = require("fs");
const path = require("path");

/**
 * Remove any global CSS/SCSS imports from TS/TSX files except app/layout.tsx
 * Next.js App Router only allows global styles imported from app/layout.
 */
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const KEEP_FILE = path.join(SRC, "app", "layout.tsx");

// Matches both:
//  - import "./style.scss";
//  - import something from "./style.scss";
const CSS_IMPORT_RE =
  /^[ \t]*import\s+(?:\{[^}]*\}\s+from\s+)?['"][^'"]+\.(?:scss|css)['"];[ \t]*\r?\n|^[ \t]*import\s+['"][^'"]+\.(?:scss|css)['"];[ \t]*\r?\n/gm;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      if (path.resolve(full) === KEEP_FILE) continue; // keep layout imports
      const text = fs.readFileSync(full, "utf8");
      const next = text.replace(CSS_IMPORT_RE, "");
      if (next !== text) {
        fs.writeFileSync(full, next);
        console.log("Cleaned CSS imports in:", path.relative(ROOT, full));
      }
    }
  }
}

walk(SRC);
console.log("Done cleaning CSS/SCSS imports (except app/layout.tsx).");
