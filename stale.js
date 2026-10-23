#!/usr/bin/env node
// The staleness screen: runs every stored list profile, unchanged, on a local
// SimulationCraft build and lists the ones whose result has moved away from
// the number on file.
//   node stale.js --simc <path to simc> [--iterations 10000] [--threads N]
//                 [--over 5] [--out <file>] [--fresh] [--page index.html] [<dir>...]
//
// A number goes stale when SimC's game data is retuned after the list was
// simmed: the profile has not changed, but the same file now gives another
// result. Two such waves (2026-09-22 and 2026-10-06) were only traced on
// 2026-10-11, when this screen was first run by hand. Run it after a SimC
// update that retunes a class.
//
// It is an instrument, not a gate, and never a number of record: those come
// from Raidbots. A local build of the same data lands within about 2 DPS of
// Raidbots on these profiles, so the default threshold of 5 is a real move.
// Results are kept in --out as they arrive; a second run resumes from there,
// and --fresh starts over. An unlisted preview (hidden:true on the page) is
// run and reported, but not held to its number: Augmentation's comes from a
// group sim that its profile alone cannot reproduce.

const fs = require("fs");
const os = require("os");
const path = require("path");
const cp = require("child_process");

const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(name); if (i < 0) return dflt; const v = args[i + 1]; args.splice(i, 2); return v; };
const flag = (name) => { const i = args.indexOf(name); if (i < 0) return false; args.splice(i, 1); return true; };
const SIMC = opt("--simc", process.env.SIMC);
const ITER = +opt("--iterations", 10000);
const THREADS = +opt("--threads", os.cpus().length);
const OVER = +opt("--over", 5);
const OUT = opt("--out", path.join(os.tmpdir(), "legacy-thirty-stale.json"));
const PAGE = opt("--page", path.join(__dirname, "index.html"));
const FRESH = flag("--fresh");
const DIRS = args.length ? args : ["All-time Full buffed", "All-time", "Obtainable", "Herald"].map(d => path.join(__dirname, "list", d));
if (!SIMC || !fs.existsSync(SIMC)) {
  console.error("usage: node stale.js --simc <path to simc> [--iterations 10000] [--threads N] [--over 5] [--out <file>] [--fresh] [<dir>...]");
  process.exit(2);
}

// The page: which number each list stands at. On an effective-DPS list the
// file name carries the effective number and the sim gives the raw one.
let CLASSES;
{
  const html = fs.readFileSync(PAGE, "utf8");
  const blocks = html.match(/<script>([\s\S]*?)<\/script>/g) || [];
  const code = blocks.sort((a, b) => b.length - a.length)[0].replace(/^<script>/, "").replace(/<\/script>$/, "");
  const cut = code.search(/^(const|let|function)\s+\$\s*=|^function whLink/m);
  ({ CLASSES } = new Function((cut > 0 ? code.slice(0, cut) : code) + "\nreturn { CLASSES };")());
}
const LIST_OF_DIR = d => {
  const b = path.basename(d).toLowerCase();
  if (/full.?buff/.test(b)) return null;              // list/old only
  if (/all.?time/.test(b)) return "alltime";
  if (/obtain/.test(b)) return "obtainable";
  if (/herald/.test(b)) return "herald";
  return null;
};
const specStr = x => typeof x.spec === "string" ? x.spec : (x.spec && (x.spec.alltime || Object.values(x.spec)[0])) || "";
function entryOf(words) {
  const cls = [...new Set(CLASSES.map(c => c.name))].sort((a, b) => b.length - a.length)
    .find(n => words.toLowerCase().startsWith(n.toLowerCase()));
  if (!cls) return null;
  const spec = words.slice(cls.length).trim().toLowerCase();
  return CLASSES.find(x => x.name === cls && spec && specStr(x).toLowerCase().startsWith(spec)) || null;
}

const version = ((cp.spawnSync(SIMC, [], { encoding: "utf8" }).stdout || "").match(/SimulationCraft [^\n]*/) || [""])[0].trim();
let done = {};
if (!FRESH) try { const j = JSON.parse(fs.readFileSync(OUT, "utf8")); if (j.build === version && j.iterations === ITER) done = j.results || {}; } catch (e) {}
const save = () => fs.writeFileSync(OUT, JSON.stringify({ build: version, iterations: ITER, results: done }, null, 1));

const jobs = [];
for (const dir of DIRS) {
  const list = LIST_OF_DIR(dir);
  if (!list) { console.error(`${dir}: not a list folder - skipped`); continue; }
  for (const f of fs.readdirSync(dir).filter(f => /^\d+\s*-\s*.+\.txt$/.test(f)).sort()) {
    const m = f.match(/^(\d+)\s*-\s*(.+)\.txt$/);
    const c = entryOf(m[2].replace(/_/g, " ").trim());
    if (!c || !((c.lists || {})[list])) continue;      // archived file, not on the page
    const raw = (c.rawByList || {})[list];
    jobs.push({ key: `${path.basename(dir)}/${f}`, file: path.resolve(dir, f), list, id: c.id,
                stored: raw != null ? raw : +m[1], effective: raw != null ? +m[1] : null,
                stamp: ((c.prov || {})[list] || "").match(/\d{4}-\d{2}-\d{2}/), preview: !!c.hidden });
  }
}

console.log(`${version || SIMC}\n${jobs.length} profiles, ${ITER} iterations, ${THREADS} thread(s); flagged beyond ${OVER} DPS and three standard errors\n`);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "stale-"));
let n = 0;
for (const j of jobs) {
  n++;
  if (done[j.key] && done[j.key].stored === j.stored) continue;
  const out = path.join(tmp, "r.json");
  try { fs.unlinkSync(out); } catch (e) {}
  const t0 = Date.now();
  const r = cp.spawnSync(SIMC, [j.file, `iterations=${ITER}`, `threads=${THREADS}`, "calculate_scale_factors=0", `json2=${out}`],
    { cwd: tmp, encoding: "utf8", maxBuffer: 1 << 26 });
  let rec;
  try {
    const d = JSON.parse(fs.readFileSync(out, "utf8")).sim.players[0].collected_data.dps;
    rec = { stored: j.stored, local: d.mean, err: d.mean_std_dev, secs: Math.round((Date.now() - t0) / 1000) };
  } catch (e) {
    rec = { stored: j.stored, error: ((r.stdout || "") + (r.stderr || "")).trim().split("\n").slice(-3).join(" | ") || String(e) };
  }
  done[j.key] = rec; save();
  process.stderr.write(`[${n}/${jobs.length}] ${j.key}: ${rec.error ? "FAILED" : rec.local.toFixed(1) + " against " + j.stored}\n`);
}
fs.rmSync(tmp, { recursive: true, force: true });

const rows = jobs.map(j => ({ ...j, ...done[j.key] }));
const failed = rows.filter(r => r.error), previews = rows.filter(r => !r.error && r.preview);
const ok = rows.filter(r => !r.error && !r.preview);
// Moved: beyond the threshold, and beyond three standard errors of the run,
// so a short run's noise is not read as a move.
const moved = ok.filter(r => Math.abs(r.local - r.stored) > Math.max(OVER, 3 * (r.err || 0)))
  .sort((a, b) => Math.abs(b.local - b.stored) - Math.abs(a.local - a.stored));
const pad = (s, w) => String(s).padEnd(w);
if (moved.length) {
  console.log(`${moved.length} of ${ok.length} more than ${OVER} DPS from the number on file:\n`);
  console.log(`  ${pad("profile", 58)} ${pad("on file", 9)} ${pad("local", 16)} ${pad("moved", 8)} simmed`);
  for (const r of moved)
    console.log(`  ${pad(r.key, 58)} ${pad(r.stored + (r.effective ? " raw" : ""), 9)} ${pad(r.local.toFixed(1) + " ±" + (r.err || 0).toFixed(1), 16)} ${pad((r.local > r.stored ? "+" : "") + (r.local - r.stored).toFixed(1), 8)} ${r.stamp ? r.stamp[0] : "?"}`);
} else console.log(`All ${ok.length} within ${OVER} DPS of the number on file.`);
const worst = ok.reduce((m, r) => Math.max(m, Math.abs(r.local - r.stored)), 0);
console.log(`\n${ok.length - moved.length} of ${ok.length} within ${OVER} DPS; largest difference ${worst.toFixed(1)}.`);
for (const r of previews)
  console.log(`Not held to its number (unlisted preview): ${r.key} reads ${r.local.toFixed(1)} alone, ${r.stored} on file.`);
for (const r of failed) console.log(`FAILED ${r.key}: ${r.error}`);
if (failed.length) process.exitCode = 1;
