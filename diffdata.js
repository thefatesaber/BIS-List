#!/usr/bin/env node
// Prints the dataset delta between two page builds.
//   node diffdata.js old.html new.html
// The commit comparator: run it on HEAD~1 vs HEAD before pushing a rebase.

const fs = require("fs");
const load = (f) => {
  const html = fs.readFileSync(f, "utf8");
  const code = (html.match(/<script>([\s\S]*?)<\/script>/g) || [])
    .sort((a, b) => b.length - a.length)[0]
    .replace(/^<script>/, "").replace(/<\/script>$/, "");
  const cut = code.search(/^(const|let|function)\s+\$\s*=|^function whLink/m);
  return new Function((cut > 0 ? code.slice(0, cut) : code) +
    "\nreturn { CLASSES, CONFIG };")();
};
const [A, B] = process.argv.slice(2);
if (!B) { console.error("usage: node diffdata.js old.html new.html"); process.exit(2); }
const a = load(A), b = load(B);
let n = 0;
const say = (m) => { console.log(m); n++; };

for (const k of new Set([...Object.keys(a.CONFIG), ...Object.keys(b.CONFIG)]))
  if (JSON.stringify(a.CONFIG[k]) !== JSON.stringify(b.CONFIG[k]))
    say(`CONFIG.${k}: ${JSON.stringify(a.CONFIG[k])} -> ${JSON.stringify(b.CONFIG[k])}`);

const LISTS = ["alltime", "obtainable", "herald"];
const ROWFIELDS = ["item", "wowhead", "ilvl", "source", "ench", "enchsp", "gems",
                   "hm", "q", "why", "alts", "altbase", "prov", "status"];
for (const ca of a.CLASSES) {
  const cb = b.CLASSES.find((c) => c.id === ca.id);
  if (!cb) { say(`${ca.id}: removed`); continue; }
  for (const f of ["dps", "spec", "name"])
    if (ca[f] !== cb[f]) say(`${ca.id}.${f}: ${ca[f]} -> ${cb[f]}`);
  for (const L of LISTS) {
    if ((ca.dpsByList || {})[L] !== (cb.dpsByList || {})[L])
      say(`${ca.id}.dps.${L}: ${(ca.dpsByList || {})[L]} -> ${(cb.dpsByList || {})[L]}`);
    if ((ca.talents || {})[L] !== (cb.talents || {})[L])
      say(`${ca.id}.talents.${L}: changed`);
    if (JSON.stringify((ca.stats || {})[L]) !== JSON.stringify((cb.stats || {})[L]))
      say(`${ca.id}.stats.${L}: changed`);
    const ra = (ca.lists || {})[L] || [], rb = (cb.lists || {})[L] || [];
    for (const slot of new Set([...ra.map((r) => r.slot), ...rb.map((r) => r.slot)])) {
      const x = ra.find((r) => r.slot === slot), y = rb.find((r) => r.slot === slot);
      if (!y) { say(`${ca.id}/${L}/${slot}: row removed (${x.item})`); continue; }
      if (!x) { say(`${ca.id}/${L}/${slot}: row added (${y.item})`); continue; }
      for (const f of ROWFIELDS)
        if (JSON.stringify(x[f]) !== JSON.stringify(y[f]))
          say(`${ca.id}/${L}/${slot}.${f}: ${JSON.stringify(x[f])} -> ${JSON.stringify(y[f])}`);
    }
  }
}
for (const cb of b.CLASSES)
  if (!a.CLASSES.find((c) => c.id === cb.id)) say(`${cb.id}: added`);
console.log(`\n${n} difference(s)`);
