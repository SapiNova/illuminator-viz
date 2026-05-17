import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'docs-src');
const outDir = path.join(root, 'docs');
const includesDir = path.join(srcDir, '_includes');
const pagesDir = path.join(srcDir, 'pages');
const assetsDir = path.join(srcDir, 'assets');

function applyVars(template, vars) {
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    out = out.replaceAll(`{{${key}}}`, value);
  }
  return out;
}

function parseFrontmatter(raw) {
  if (!raw.startsWith('---\n')) {
    throw new Error('Page must start with YAML frontmatter (---)');
  }
  const end = raw.indexOf('\n---\n', 4);
  if (end === -1) throw new Error('Page frontmatter not closed with ---');
  const meta = {};
  for (const line of raw.slice(4, end).split('\n')) {
    const i = line.indexOf(':');
    if (i === -1) continue;
    meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  const content = raw.slice(end + 5);
  return { meta, content };
}

async function copyDir(from, to) {
  await fs.mkdir(to, { recursive: true });
  for (const entry of await fs.readdir(from, { withFileTypes: true })) {
    const srcPath = path.join(from, entry.name);
    const destPath = path.join(to, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function removeGeneratedHtml(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await removeGeneratedHtml(full);
      const remaining = await fs.readdir(full);
      if (remaining.length === 0) await fs.rmdir(full);
    } else if (entry.name.endsWith('.html')) {
      await fs.unlink(full);
    }
  }
}

async function build() {
  const partials = {};
  for (const name of ['head', 'header', 'sidebar', 'foot']) {
    partials[name] = await fs.readFile(path.join(includesDir, `${name}.html`), 'utf8');
  }

  await fs.mkdir(outDir, { recursive: true });
  await removeGeneratedHtml(outDir);
  await copyDir(assetsDir, outDir);

  const pageFiles = (await fs.readdir(pagesDir)).filter((f) => f.endsWith('.html'));
  for (const file of pageFiles) {
    const raw = await fs.readFile(path.join(pagesDir, file), 'utf8');
    const { meta, content } = parseFrontmatter(raw);
    if (!meta.title || !meta.path) {
      throw new Error(`${file}: frontmatter requires title and path`);
    }
    const vars = {
      title: meta.title,
      logoHref: meta.logoHref || '/docs/',
    };
    const html = [
      '<!DOCTYPE html>',
      '<html lang="en">',
      applyVars(partials.head, vars),
      '<body>',
      applyVars(partials.header, vars),
      partials.sidebar,
      content.trim(),
      partials.foot,
    ].join('\n\n');

    const outPath = path.join(outDir, meta.path);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, html, 'utf8');
    console.log('  wrote', meta.path);
  }

  console.log(`Built ${pageFiles.length} doc pages into docs/`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
