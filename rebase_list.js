#!/usr/bin/env node
// Rebases one list of one spec on a BracketSim run: the profile the site's
// Advanced tab ran and the report it wrote become the page's number, talents,
// stat panel and gear rows for that list.
//
//   node rebase_list.js --spec shaman --list alltime \
//        --profile "list/All-time/5487 - Shaman Restoration.simc" \
//        --report  "list/All-time/5487 - Shaman Restoration.html" [--page index.html] [--dry]
//
// What it reads: the profile's header (DPS, sim date, engine), its talents=
// line and every gear line; the report's gear table (the item level each
// slot ran at) and its raid-buffed stat table. What it writes: dpsByList,
// dps (on All-Time), talents, prov ("simmed <date> · BracketSim"), stats
// and the list's rows, then the whole CLASSES block in its canonical layout.
// A row's name and quality come from gamedata.json; its source line, its
// enchant's spell and its badges (hm) are carried from a row the page already
// has for the item. An item the page has never shown gets "SOURCE?" and the
// run says so: write the source by hand before landing. Alternates are not
// carried: a re-run list has no sweep of record until one is read on it.
// Run the two gates after it.

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const PAGE = opt("--page", "index.html"), SPEC = opt("--spec"), LIST = opt("--list");
const PROFILE = opt("--profile"), REPORT = opt("--report"), DRY = args.includes("--dry");
if (!SPEC || !LIST || !PROFILE || !REPORT) {
  console.error("usage: node rebase_list.js --spec <page id> --list alltime|obtainable|herald --profile <.simc> --report <.html> [--page index.html] [--dry]");
  process.exit(2);
}
const GD = require("./gamedata.js").load();

// ---------------------------------------------------------------- page
let html = fs.readFileSync(PAGE, "utf8");
const S = html.indexOf("const CLASSES = [");
const E = html.indexOf("\n];", S) + 3;
const CONFIG = { patch: "x", heraldRule: "y" };
const CLASSES = eval("(" + html.slice(S, E).replace("const CLASSES = ", "").replace(/;\s*$/, "") + ")");
const c = CLASSES.find((x) => x.id === SPEC);
if (!c) { console.error(`no page entry with id "${SPEC}"`); process.exit(2); }
if (!["alltime", "obtainable", "herald"].includes(LIST)) { console.error(`unknown list "${LIST}"`); process.exit(2); }

// ---------------------------------------------------------------- profile
const prof = fs.readFileSync(PROFILE, "utf8");
const lines = prof.split(/\r?\n/);
const hdr = (re) => { const m = prof.match(re); return m ? m[1].trim() : null; };
const engine = hdr(/^#\s*Engine of record\s*:\s*([A-Za-z]+)/m);
const simDate = hdr(/^#\s*Simmed\s*:\s*(\d{4}-\d{2}-\d{2})/m);
const resultDps = hdr(/^#\s*Result\s*:\s*([\d,]+)\s*DPS/m);
if (engine !== "BracketSim") { console.error(`profile header names no "Engine of record : BracketSim"`); process.exit(2); }
if (!simDate || !resultDps) { console.error(`profile header lacks "Simmed : YYYY-MM-DD" or "Result : N DPS"`); process.exit(2); }
const dps = +resultDps.replace(/,/g, "");
const fname = path.basename(PROFILE).match(/^(\d+)\s*-/);
if (!fname || +fname[1] !== dps) console.error(`warning: filename DPS ${fname && fname[1]} differs from the header's ${dps}`);
const talents = (lines.find((l) => /^talents=/.test(l)) || "").slice(8);
if (!talents) { console.error("no talents= line"); process.exit(2); }

const SLOT_NAME = { head: "Head", neck: "Neck", shoulders: "Shoulders", shoulder: "Shoulders", back: "Back", chest: "Chest",
  wrists: "Wrist", wrist: "Wrist", hands: "Hands", waist: "Waist", legs: "Legs", feet: "Feet", finger1: "Ring 1", finger2: "Ring 2",
  trinket1: "Trinket 1", trinket2: "Trinket 2", main_hand: "Main Hand", off_hand: "Off Hand" };
const ORDER = ["Head", "Neck", "Shoulders", "Back", "Chest", "Wrist", "Hands", "Waist", "Legs", "Feet", "Ring 1", "Ring 2", "Trinket 1", "Trinket 2", "Main Hand", "Off Hand"];
const gear = [];
for (const l of lines) {
  const m = l.match(/^([a-z_0-9]+)=(.*)$/);
  if (!m || !SLOT_NAME[m[1]]) continue;
  const kv = {};
  for (const p of m[2].split(",")) { const j = p.indexOf("="); if (j > 0) kv[p.slice(0, j)] = p.slice(j + 1); }
  if (!kv.id) { console.error(`${m[1]}= line has no id=`); process.exit(2); }
  gear.push({ slot: SLOT_NAME[m[1]], id: +kv.id, ilvl: kv.ilevel ? +kv.ilevel : null, enchant: kv.enchant_id ? +kv.enchant_id : null,
    gems: (kv.gem_id || "").split("/").filter((g) => g && g !== "0").map(Number) });
}

// ---------------------------------------------------------------- report
const rep = fs.readFileSync(REPORT, "utf8");
const text = rep.replace(/<[^>]+>/g, "|").replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'")
  .replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\|+/g, "|").replace(/\s+/g, " ");
// gear table: "|Local| |Head| |Helm of Desolation| | | | |ilevel: 33, stats: ..."
const ilvlAt = {};
const SLOT_REPORT = { Head: "Head", Neck: "Neck", Shoulders: "Shoulders", Back: "Back", Chest: "Chest", Wrists: "Wrist", Hands: "Hands",
  Waist: "Waist", Legs: "Legs", Feet: "Feet", Finger1: "Ring 1", Finger2: "Ring 2", Trinket1: "Trinket 1", Trinket2: "Trinket 2",
  "Main Hand": "Main Hand", "Off Hand": "Off Hand" };
for (const m of text.matchAll(/\|(Head|Neck|Shoulders|Back|Chest|Wrists|Hands|Waist|Legs|Feet|Finger1|Finger2|Trinket1|Trinket2|Main Hand|Off Hand)\| \|([^|]+)\|[ |]*ilevel: (\d+),/g))
  ilvlAt[SLOT_REPORT[m[1]]] = { ilvl: +m[2 + 1], name: m[2].trim() };
// raid-buffed stat table: "|Intellect|65|-1|337|308|230 (52)|" (buffed, unbuffed, gear)
// the stat table follows its "Raid-Buffed" head; the first table after it
const statText = (() => { const i = text.indexOf("Raid-Buffed|"); return i < 0 ? "" : text.slice(i, i + 4000); })();
const stat = (label) => { const m = statText.match(new RegExp("\\|" + label + "\\|([^|]*)\\|([^|]*)\\|([^|]*)\\|([^|]*)\\|")); return m ? m.slice(1).map((x) => x.trim()) : null; };
const pct = (label) => { const m = statText.match(new RegExp("\\|" + label + "\\|([\\d.]+)% \\((\\d+)\\)\\|")); return m ? [+m[1], +m[2]] : null; };
const MAIN = { Strength: "Strength", Agility: "Agility", Intellect: "Intellect" };
const mainLabel = Object.keys(MAIN).find((k) => { const s = stat(k); return s && +s[2] > 100; }) || "Intellect";
const main = stat(mainLabel), stam = stat("Stamina");
const stats = { main: +main[2], stam: +stam[2], crit: pct("Crit"), mastery: pct("Mastery"), haste: pct("Haste"), vers: pct("Versatility") };
for (const [k, v] of Object.entries(stats)) if (v == null || Number.isNaN(v)) { console.error(`report: cannot read ${k}`); process.exit(2); }
const repDps = text.match(/\|([\d,]+\.\d)\|[\d,.]+\|[\d.]+ \/ [\d.]+%\|/);
if (repDps && Math.round(+repDps[1].replace(/,/g, "")) !== dps) console.error(`warning: report DPS ${repDps[1]} differs from the header's ${dps}`);

// ---------------------------------------------------------------- rows
const everyRow = [];
for (const x of CLASSES) for (const L of Object.keys(x.lists || {})) for (const r of x.lists[L]) everyRow.push({ c: x, L, r });
const prevRows = (c.lists || {})[LIST] || [];
const problems = [];
const rows = [];
for (const g of gear) {
  const it = GD.items[g.id];
  if (!it) { problems.push(`${g.slot}: item ${g.id} is not in gamedata.json - node gamedata.js --fetch`); continue; }
  const at = ilvlAt[g.slot];
  if (!at) problems.push(`${g.slot}: the report's gear table has no ${g.slot} line`);
  const ilvl = g.ilvl != null ? g.ilvl : at ? at.ilvl : null;
  if (at && g.ilvl != null && at.ilvl !== g.ilvl) problems.push(`${g.slot}: profile ilevel=${g.ilvl}, report ran it at ${at.ilvl}`);
  const same = (r) => r.wowhead === g.id;
  const prev = prevRows.find((r) => r.slot === g.slot && same(r)) || prevRows.find(same);
  const anyRow = prev || (everyRow.find((x) => x.c === c && same(x.r)) || everyRow.find((x) => same(x.r)) || {}).r;
  const row = { slot: g.slot, item: it.name, wowhead: g.id };
  if (it.quality !== 4) row.q = it.quality;
  if (ilvl != null) row.ilvl = ilvl;
  row.source = anyRow && anyRow.source ? anyRow.source : "SOURCE?";
  if (row.source === "SOURCE?") problems.push(`${g.slot}: ${it.name} (${g.id}) has never been on the page - write its source`);
  if (g.enchant != null) {
    const en = GD.enchants[g.enchant];
    if (!en) problems.push(`${g.slot}: enchant ${g.enchant} is not in gamedata.json - node gamedata.js --fetch`);
    // the spell the page links for this enchant, on this slot first
    const fits = (x) => x.r.enchsp != null && GD.spells[x.r.enchsp] && GD.spells[x.r.enchsp].enchants.includes(g.enchant);
    const hit = everyRow.find((x) => x.r.slot === g.slot && fits(x)) || everyRow.find(fits);
    const own = en && en.spell && GD.spells[en.spell] ? en.spell : null;   // the enchant table's own spell
    if (hit) { row.ench = hit.r.ench; row.enchsp = hit.r.enchsp; }
    else if (own) { row.ench = GD.spells[own].name.replace(/^Apply /, ""); row.enchsp = own; }
    else problems.push(`${g.slot}: enchant ${g.enchant}${en ? " (" + en.name + ")" : ""} has no spell on the page - add ench/enchsp by hand (and gamedata.js MANUAL_SPELLS if the data cannot resolve it)`);
  }
  if (g.gems.length) {
    const seen = [];
    for (const id of g.gems) {
      const gi = GD.items[id];
      if (!gi) { problems.push(`${g.slot}: gem ${id} is not in gamedata.json`); continue; }
      const e = seen.find((x) => x.id === id);
      if (e) e.n++; else { const x = { id, name: gi.name, n: 1 }; if (gi.quality !== 4) x.q = gi.quality; seen.push(x); }
    }
    row.gems = seen;
  }
  if (anyRow && anyRow.hm) row.hm = anyRow.hm;
  if (prev && prev.why) row.why = prev.why;
  rows.push(row);
}
rows.sort((a, b) => ORDER.indexOf(a.slot) - ORDER.indexOf(b.slot));

// consumables: the profile's against the panel's
const tok = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
const cons = c.consumables && (c.consumables.potion || c.consumables.flask || c.consumables.food || c.consumables.oil) ? c.consumables : (c.consumables || {})[LIST];
const want = { potion: (lines.find((l) => /^potion=/.test(l)) || "").slice(7), flask: (lines.find((l) => /^flask=/.test(l)) || "").slice(6), food: (lines.find((l) => /^food=/.test(l)) || "").slice(5) };
for (const k of ["potion", "flask", "food"]) {
  const have = cons && cons[k] && cons[k].item;
  if (want[k] && want[k] !== "disabled" && tok(have) !== tok(want[k])) problems.push(`consumables: profile ${k}=${want[k]}, the panel shows ${have || "nothing"} - update the panel by hand`);
}

// ---------------------------------------------------------------- write
c.dpsByList = c.dpsByList || {}; c.dpsByList[LIST] = dps;
if (LIST === "alltime") c.dps = dps;
c.talents = c.talents || {}; c.talents[LIST] = talents;
c.prov = c.prov || {}; c.prov[LIST] = `simmed ${simDate} · BracketSim`;
c.stats = c.stats || {}; c.stats[LIST] = stats;
c.lists = c.lists || {}; c.lists[LIST] = rows;
if (c.rawByList && c.rawByList[LIST] != null) { delete c.rawByList[LIST]; if (!Object.keys(c.rawByList).length) delete c.rawByList; problems.push(`rawByList.${LIST} dropped: an effective number needs its factor re-read on the new run`); }

const J = (v) => JSON.stringify(v).replace(/,"/g, ', "').replace(/":/g, '": ');
const Jrow = (v) => J(v).replace(/,\{/g, ", {");
function fmtSpec(x) {
  const scalar = ["id", "cls", "primary", "name", "spec", "color", "hidden", "dps", "dpsByList", "rawByList"];
  const head = [];
  for (const k of scalar) if (k in x) head.push(`${k}:${J(x[k])}`);
  const out = ["{ " + head.join(", ") + ","];
  const rest = Object.keys(x).filter((k) => !scalar.includes(k));
  rest.forEach((k, i) => {
    const last = i === rest.length - 1;
    if (k === "lists") {
      out.push("  lists:{");
      const ls = Object.keys(x.lists);
      ls.forEach((L, j) => {
        out.push(`    ${L}:[`);
        x.lists[L].forEach((r, n) => out.push(`      ${Jrow(r)}${n === x.lists[L].length - 1 ? "" : ","}`));
        out.push(`    ]${j === ls.length - 1 ? "" : ","}`);
      });
      out.push("  }" + (last ? "" : ","));
    } else out.push(`  ${k}:${Jrow(x[k])}${last ? "" : ","}`);
  });
  out.push("}");
  return out.join("\n");
}
html = html.slice(0, S) + "const CLASSES = [\n" + CLASSES.map(fmtSpec).join(",\n") + "\n];" + html.slice(E);
if (!DRY) fs.writeFileSync(PAGE, html);

console.log(`${SPEC}/${LIST}: ${dps} DPS, simmed ${simDate} on BracketSim, ${rows.length} rows, stats main ${stats.main} stam ${stats.stam} crit ${stats.crit} mastery ${stats.mastery} haste ${stats.haste} vers ${stats.vers}`);
for (const r of rows) console.log(`  ${r.slot.padEnd(9)} ${r.item} (${r.wowhead}) ilvl ${r.ilvl}${r.ench ? " / " + r.ench : ""}${r.gems ? " / " + r.gems.map((g) => (g.n > 1 ? g.n + "x " : "") + g.name).join(", ") : ""}${r.hm ? " / hm:" + r.hm : ""}`);
for (const p of problems) console.log("!  " + p);
console.log(DRY ? "(dry run - nothing written)" : `${PAGE} written - now: node validate.js ${PAGE} && node lint_profiles.js --page ${PAGE} "${path.dirname(PROFILE)}"`);
process.exit(problems.length ? 1 : 0);
