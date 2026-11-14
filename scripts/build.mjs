import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { parse } from 'yaml';

const root = fileURLToPath(new URL('../', import.meta.url));
const knowledge = join(root, 'knowledge');
const output = join(root, 'dist');

async function collectArticles(folder = '') {
  const entries = await readdir(join(knowledge, folder), { withFileTypes: true });
  const articles = [];

  for (const entry of entries) {
    const relativePath = folder ? `${folder}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      articles.push(...await collectArticles(relativePath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const source = await readFile(join(knowledge, relativePath), 'utf8');
      const header = source.match(/^\uFEFF?---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
      try {
        if (!header) throw new Error('先頭にYAMLのメタデータがありません');
        const metadata = parse(header[1]);
        for (const key of ['title', 'subtitle']) {
          if (typeof metadata?.[key] !== 'string' || !metadata[key].trim()) {
            throw new Error(`${key} に文字列を指定してください`);
          }
        }
        articles.push({
          title: metadata.title.trim(),
          subtitle: metadata.subtitle.trim(),
          path: `knowledge/${relativePath}`,
        });
      } catch (error) {
        throw new Error(`knowledge/${relativePath} — ${error.message}`, { cause: error });
      }
    }
  }

  return articles;
}

const articles = await collectArticles();
articles.sort((left, right) =>
  left.title.localeCompare(right.title, 'ja') || left.path.localeCompare(right.path, 'ja'));

await rm(output, { recursive: true, force: true });
await mkdir(output);
await Promise.all([
  cp(knowledge, join(output, 'knowledge'), { recursive: true }),
  cp(join(root, 'web/index.html'), join(output, 'index.html')),
  cp(join(root, 'web/style.css'), join(output, 'style.css')),
  writeFile(join(output, 'index.json'), `${JSON.stringify(articles, null, 2)}\n`),
  build({
    entryPoints: [join(root, 'web/app.js')],
    outfile: join(output, 'app.js'),
    bundle: true,
    format: 'esm',
    target: 'es2022',
  }),
]);

console.log(`Generated dist/index.json with ${articles.length} article(s).`);
