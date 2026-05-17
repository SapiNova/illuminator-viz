import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = [
  { src: 'docs/index.html', out: 'docs-src/pages/index.html', title: 'Illuminator - 2D Graph Editor & Renderer', path: 'index.html', logoHref: '/' },
  { src: 'docs/shortcuts/index.html', out: 'docs-src/pages/shortcuts.html', title: 'Keyboard Shortcuts - Illuminator', path: 'shortcuts/index.html' },
  { src: 'docs/tools/index.html', out: 'docs-src/pages/tools.html', title: 'Tools - Illuminator', path: 'tools/index.html' },
  { src: 'docs/layouts/index.html', out: 'docs-src/pages/layouts.html', title: 'Layout Algorithms - Illuminator', path: 'layouts/index.html' },
  { src: 'docs/ui/index.html', out: 'docs-src/pages/ui.html', title: 'User Interface - Illuminator', path: 'ui/index.html' },
  { src: 'docs/commands/index.html', out: 'docs-src/pages/commands.html', title: 'Command Reference - Illuminator', path: 'commands/index.html' },
  { src: 'docs/query/index.html', out: 'docs-src/pages/query.html', title: 'Query Language - Illuminator', path: 'query/index.html' },
  { src: 'docs/data/index.html', out: 'docs-src/pages/data.html', title: 'File Formats & Attributes - Illuminator', path: 'data/index.html' },
];

for (const p of pages) {
  const html = fs.readFileSync(path.join(root, p.src), 'utf8');
  const m = html.match(/<main class="main">([\s\S]*?)<\/main>/);
  if (!m) throw new Error(`No <main> in ${p.src}`);
  const logoHref = p.logoHref ?? '/docs/';
  const fm = ['---', `title: ${p.title}`, `path: ${p.path}`, `logoHref: ${logoHref}`, '---', ''].join('\n');
  const outPath = path.join(root, p.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, fm + `<main class="main">${m[1]}</main>\n`);
}

const assetsDir = path.join(root, 'docs-src/assets');
fs.mkdirSync(assetsDir, { recursive: true });
fs.copyFileSync(path.join(root, 'docs/style.css'), path.join(assetsDir, 'style.css'));
fs.copyFileSync(path.join(root, 'docs/search.js'), path.join(assetsDir, 'search.js'));
console.log('Extracted', pages.length, 'pages into docs-src/');
