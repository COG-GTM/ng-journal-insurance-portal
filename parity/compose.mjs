// Builds side-by-side baseline|upgraded images, pixel diffs and report/README.md from the parity run.
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const root = path.dirname(new URL(import.meta.url).pathname);
const report = path.join(root, 'report');
const screens = path.join(report, 'screens');
const sideDir = path.join(report, 'side-by-side');
const diffDir = path.join(report, 'diff');
fs.mkdirSync(sideDir, { recursive: true });
fs.mkdirSync(diffDir, { recursive: true });

const read = (p) => (fs.existsSync(p) ? PNG.sync.read(fs.readFileSync(p)) : null);
const pad = (img, w, h) => {
  const out = new PNG({ width: w, height: h });
  out.data.fill(255);
  if (img) PNG.bitblt(img, out, 0, 0, img.width, img.height, 0, 0);
  return out;
};

const names = [...new Set(['baseline', 'upgraded'].flatMap((p) =>
  fs.existsSync(path.join(screens, p)) ? fs.readdirSync(path.join(screens, p)) : []))]
  .filter((f) => f.endsWith('.png')).sort();

const shots = [];
for (const file of names) {
  const a = read(path.join(screens, 'baseline', file));
  const b = read(path.join(screens, 'upgraded', file));
  const w = Math.max(a?.width ?? 0, b?.width ?? 0);
  const h = Math.max(a?.height ?? 0, b?.height ?? 0);
  const pa = pad(a, w, h), pb = pad(b, w, h);
  const gap = 20;
  const side = new PNG({ width: w * 2 + gap, height: h });
  side.data.fill(200);
  PNG.bitblt(pa, side, 0, 0, w, h, 0, 0);
  PNG.bitblt(pb, side, 0, 0, w, h, w + gap, 0);
  fs.writeFileSync(path.join(sideDir, file), PNG.sync.write(side));
  let pct = null;
  if (a && b) {
    const diff = new PNG({ width: w, height: h });
    const n = pixelmatch(pa.data, pb.data, diff.data, w, h, { threshold: 0.1 });
    fs.writeFileSync(path.join(diffDir, file), PNG.sync.write(diff));
    pct = (100 * n) / (w * h);
  }
  shots.push({ name: file.replace('.png', ''), pct, baseline: !!a, upgraded: !!b });
}

const results = fs.existsSync(path.join(report, 'results.json'))
  ? JSON.parse(fs.readFileSync(path.join(report, 'results.json'), 'utf8')) : { suites: [] };
const flows = new Map();
const walk = (suite, prefix) => {
  const title = [prefix, suite.title].filter((t) => t && !t.endsWith('.ts')).join(' › ');
  for (const spec of suite.specs ?? []) {
    for (const t of spec.tests) {
      const key = [title, spec.title].filter(Boolean).join(' › ');
      const row = flows.get(key) ?? {};
      row[t.projectName] = t.status === 'expected' || t.status === 'flaky' ? 'pass' : t.status === 'skipped' ? 'skipped' : 'fail';
      flows.set(key, row);
    }
  }
  for (const s of suite.suites ?? []) walk(s, title);
};
for (const s of results.suites) walk(s, '');

const count = (p, v) => [...flows.values()].filter((r) => r[p] === v).length;
const lines = [
  '# Parity report', '',
  `Baseline: ${count('baseline', 'pass')} pass / ${count('baseline', 'fail')} fail. Upgraded: ${count('upgraded', 'pass')} pass / ${count('upgraded', 'fail')} fail.`, '',
  '## Flows', '', '| Page / flow | Baseline | Upgraded |', '| --- | --- | --- |',
  ...[...flows].map(([k, r]) => `| ${k} | ${r.baseline ?? 'n/a'} | ${r.upgraded ?? 'n/a'} |`), '',
  '## Screenshots (pixel diff, threshold 0.1)', '', '| Page | Diff % | Side by side (baseline left, upgraded right) |', '| --- | --- | --- |',
  ...shots.map((s) => `| ${s.name} | ${s.pct === null ? 'missing' : s.pct.toFixed(2) + '%'} | [image](side-by-side/${s.name}.png) |`), '',
];
const metricsFile = path.join(report, 'metrics.json');
if (fs.existsSync(metricsFile)) {
  const m = JSON.parse(fs.readFileSync(metricsFile, 'utf8'));
  lines.push('## Build metrics', '', m.note, '', '| | Baseline | Upgraded |', '| --- | --- | --- |',
    ...['angular', 'builder', 'buildSeconds', 'initialRaw', 'initialTransfer', 'distBytes'].map((k) => `| ${k} | ${m.baseline[k]} | ${m.upgraded[k]} |`), '');
}
fs.writeFileSync(path.join(report, 'README.md'), lines.join('\n'));
console.log(lines.slice(0, 3).join('\n'));
