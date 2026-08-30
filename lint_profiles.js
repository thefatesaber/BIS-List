#!/usr/bin/env node
// Lints the .simc benchmark profiles against the page dataset and the
// standing profile rulings.
//   node lint_profiles.js [--advisory] [--page index.html] <dir> [<dir>...]
// Exits 1 on errors unless --advisory is given (CI runs advisory until the
// rebase waves land, then the flag is removed and drift can't merge).
//
// Rulings encoded here (see PROJECT.md for the full record):
//  - self-buffed rail: no power_infusion pooling, invoking, or casting
//  - spell 10060 was removed from client data; overriding it segfaults
//  - enemy_custom_health_timeline stays commented — standby only
//  - target_level must be relative (+=) or absent
//  - hunters_mark=1 is reconciliation-only, never benchmark
//  - synthetic proc tokens are lowercase and end in _proxy (no DBC collisions)
//  - head-slot enchant=<stat> tokens are set-bonus proxies: preserved, and
//    never sharing a line with a real enchant_id; any other slot must use
//    enchant_id only
//  - every id= item line carries an explicit ilevel= pinned to the page
//  - one item id, one ilvl; page and profile agree on both
//  - Survival profiles carry override.spell_data=effect.483865.base_value=0
//  - calibrations of record are per-spec (flat % encodes ppm at that spec's
//    event density); deviations flagged, pending-ruling spreads warned

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const ADVISORY = args.includes("--advisory");
let PAGE = "index.html";
const pi = args.indexOf("--page");
if (pi >= 0) { PAGE = args[pi + 1]; args.splice(pi, 2); }
const DIRS = args.filter(a => a !== "--advisory");
if (!DIRS.length) { console.error("usage: node lint_profiles.js [--advisory] [--page index.html] <dir>..."); process.exit(2); }

// ---------------------------------------------------------------- page data
let CLASSES;
try {
  const html = fs.readFileSync(PAGE, "utf8");
  const blocks = html.match(/<script>([\s\S]*?)<\/script>/g) || [];
  const code = blocks.sort((a, b) => b.length - a.length)[0]
    .replace(/^<script>/, "").replace(/<\/script>$/, "");
  const cut = code.search(/^(const|let|function)\s+\$\s*=|^function whLink/m);
  ({ CLASSES } = new Function((cut > 0 ? code.slice(0, cut) : code) + "\nreturn { CLASSES };")());
} catch (e) { console.error(`cannot read page data from ${PAGE}: ${e.message}`); process.exit(2); }

const LIST_OF_DIR = d => {
  const b = path.basename(d).toLowerCase();
  if (/all.?time/.test(b)) return "alltime";
  if (/obtain/.test(b)) return "obtainable";
  if (/herald/.test(b)) return "herald";
  return null;
};

const SLOTS = ["head","neck","shoulder","back","chest","wrist","hands","waist","legs","feet",
               "finger1","finger2","trinket1","trinket2","main_hand","off_hand","shirt","tabard"];
const PAGE_SLOT = { head:"Head", neck:"Neck", shoulder:["Shoulder","Shoulders"], back:"Back", chest:"Chest",
  wrist:"Wrist", hands:"Hands", waist:"Waist", legs:"Legs", feet:"Feet",
  main_hand:"Main Hand", off_hand:"Off Hand" };
const PAIRS = { finger1:["Ring 1","Ring 2"], finger2:["Ring 1","Ring 2"],
                trinket1:["Trinket 1","Trinket 2"], trinket2:["Trinket 1","Trinket 2"] };

// Calibrations of record, keyed by the proc's stat signature. Flat % rates
// are per-spec by ruling; ppm entries are per-spec too. `pending` marks
// spreads awaiting the Dragonspine/Bonereaver per-spec ruling — warned, not
// failed, so the ruling (not the linter) settles them.
const CALIBRATIONS = {
  "108haste_10dur_20cd": { label: "Dragonspine Trophy", rates: { "*": 2.7 },
    pending: [{ cls: "warrior", rate: 3.5, note: "per-spec ruling A open" }] },
  "97str_8dur":          { label: "The Untamed Blade", rates: { warrior: 4, paladin: 14 } },
  "51crit_10dur_3stack": { label: "Bonereaver's Edge", rates: { deathknight: 11 },
    pending: [{ cls: "warrior", rate: 4, note: "per-spec ruling A open" }] },
  "281haste_10dur":      { label: "The Jackhammer", rates: { warrior: 2 } },
  "184haste_5dur":       { label: "Eskhandar's Right Claw", ppm: { monk: 2.5, rogue: 1.2 } },
  "37str_15dur":         { label: "Crusader (ring encoding)", rates: { warrior: 1.3, paladin: 5.3 } },
};

const errs = [], warns = [];
let files = 0;
const seenRates = new Map(); // `${cls}|${sig}` -> Map(rate -> [where])

const tokenizeName = s => (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

for (const dir of DIRS) {
  const list = LIST_OF_DIR(dir);
  if (!list) { warns.push(`${dir}: not a benchmark list directory — skipped`); continue; }
  let names;
  try { names = fs.readdirSync(dir).filter(f => f.endsWith(".txt")); }
  catch (e) { errs.push(`${dir}: ${e.message}`); continue; }

  for (const fname of names.sort()) {
    if (fname === "CHANGES.txt") continue;
    files++;
    const fp = path.join(dir, fname);
    const E = m => errs.push(`${fp}: ${m}`);
    const W = m => warns.push(`${fp}: ${m}`);
    const text = fs.readFileSync(fp, "utf8");
    const lines = text.split(/\r?\n/);

    // -------- filename: "<dps> - <Class> <Spec>.txt", space or underscore
    const m = fname.match(/^(\d+)\s*-\s*(.+)\.txt$/);
    if (!m) { E(`filename does not parse as "<dps> - <Class> <Spec>.txt"`); continue; }
    const fdps = +m[1];
    const words = m[2].replace(/_/g, " ").trim();
    const cls = CLASSES.map(c => c.name).sort((a, b) => b.length - a.length)
      .find(n => words.toLowerCase().startsWith(n.toLowerCase()));
    if (!cls) { E(`no class matches "${words}"`); continue; }
    const c = CLASSES.find(x => x.name === cls);
    const specName = words.slice(cls.length).trim();

    // Prefix-tolerant spec match ("Devour" checks against "Devourer").
    const onPage = specName && c.spec &&
      (c.spec.toLowerCase() === specName.toLowerCase() ||
       c.spec.toLowerCase().startsWith(specName.toLowerCase()));
    const survival = c.id === "hunter" && /^surv/i.test(specName);
    if (!onPage && !survival) { E(`spec "${specName}" is not the page spec "${c.spec}"`); continue; }

    const rows = onPage ? (c.lists || {})[list] || [] : [];
    if (onPage && fdps !== (c.dpsByList || {})[list])
      E(`filename dps ${fdps} != page dpsByList.${list} ${(c.dpsByList || {})[list]}`);

    // -------- whole-file rulings
    const has = re => lines.some(l => re.test(l));
    const where = re => lines.map((l, i) => re.test(l) ? i + 1 : 0).filter(Boolean);

    for (const n of where(/^external_buffs\.pool=/))
      E(`line ${n}: external_buffs pool — external buffs are out; the rail is self-buffed`);
    for (const n of where(/^actions[^#]*invoke_external_buff/))
      E(`line ${n}: invoke_external_buff — external buffs are out; the rail is self-buffed`);
    if (c.id !== "priest")
      for (const n of where(/^actions[^#]*\/power_infusion\b(?!_)/))
        E(`line ${n}: power_infusion cast on a non-priest — not their kit; the rail is own-kit-only`);
    for (const n of where(/^override\.spell_data=spell\.10060\./))
      if (c.id !== "priest" || lines[n - 1].trim() !== "override.spell_data=spell.10060.spell_level=1")
        E(`line ${n}: spell 10060 override — the PI level-gate relaxation is sanctioned on priest profiles only, and only as spell_level=1`);
    for (const n of where(/^enemy_custom_health_timeline/))
      E(`line ${n}: health timeline enabled — standby only, keep commented`);
    if (!has(/^#\s*enemy_custom_health_timeline/) && !has(/^enemy_custom_health_timeline/))
      W(`standby line "#enemy_custom_health_timeline=20:0.2" missing`);
    for (const n of where(/^target_level=\+/))
      E(`line ${n}: target_level=+N parses as absolute level N — use target_level+=N`);
    for (const n of where(/^target_level=(\d|1[0-9])$/))
      E(`line ${n}: absolute target_level below 20 — level-3-boss bug`);
    if (has(/^override\.hunters_mark=1/))
      E(`hunters_mark=1 — reconciliation-only, never in a benchmark profile`);
    if (!has(/^temporary_enchant=disabled/)) E(`temporary_enchant=disabled missing`);
    for (const n of where(/^temporary_enchant=\s*$/))
      E(`line ${n}: blank temporary_enchant= — triggers the fallback; delete the line`);
    if (!has(/^augmentation=disabled/))
      E(`augmentation=disabled missing — blank field falls back to an augment rune`);
    if (survival && !has(/^override\.spell_data=effect\.483865\.base_value=0/))
      E(`Survival profile missing the Mongoose Fury neutralizer (effect.483865.base_value=0)`);

    if (onPage) {
      const t = lines.find(l => /^talents=/.test(l));
      const pageT = (c.talents || {})[list];
      if (t && pageT && t.slice(8) !== pageT) W(`talents string differs from page talents.${list} — expected until the wave rebases the page`);
    }

    // -------- gear lines
    const seenSlot = {};
    const pairIds = {};                       // "finger"/"trinket" -> [{id,ilvl,ln}]
    lines.forEach((line, i) => {
      const ln = i + 1;
      const gm = line.match(/^([a-z_0-9]+)=(.*)$/);
      if (!gm || !SLOTS.includes(gm[1])) return;
      const slot = gm[1], rest = gm[2];
      if (seenSlot[slot]) E(`line ${ln}: duplicate ${slot}= line (first at ${seenSlot[slot]})`);
      else seenSlot[slot] = ln;

      const parts = rest.split(",");
      const named = parts[0] && !parts[0].includes("=") ? parts[0] : null;
      const kv = {};
      for (const p of parts) { const j = p.indexOf("="); if (j > 0) kv[p.slice(0, j)] = p.slice(j + 1); }

      // naming: id lines take no name token; nameless-id items are the house
      // style, and a name mismatching the DBC entry only warns and confuses.
      // True synthetics (no id=) are lowercase with the _proxy suffix.
      if (named && kv.id)
        E(`line ${ln}: name token "${named}" on an id= line — drop it (SimC resolves the item from the id)`);
      else if (named && (/[A-Z]/.test(named) || !/_proxy$/.test(named)))
        E(`line ${ln}: synthetic "${named}" — rename to "${named.toLowerCase().replace(/_proxy$/, "")}_proxy" (lowercase + _proxy; DBC name collisions drop silently)`);

      // enchant rules
      if ("enchant" in kv && kv.enchant && kv.enchant !== "disabled") {
        if (/^\d+[a-z_]+$/.test(kv.enchant)) {
          if (slot !== "head")
            E(`line ${ln}: stat-token enchant=${kv.enchant} on ${slot} — real enchants use enchant_id (head is the only proxy slot)`);
          else if ("enchant_id" in kv)
            E(`line ${ln}: head proxy shares the line with enchant_id — later param overrides the proxy`);
        } else {
          E(`line ${ln}: enchant=${kv.enchant} — use enchant_id`);
        }
      }

      // gems
      for (const g of (kv.gem_id || "").split("/").filter(Boolean)) {
        if (g === "25899" && slot !== "main_hand" && slot !== "off_hand")
          E(`line ${ln}: Brutal Earthstorm Diamond (25899) off-weapon — segfaults enchants.cpp:168; use 32409`);
        if (g === "76885") E(`line ${ln}: meta 76885 — ruling is Mystical Skyfire Diamond 25893`);
      }

      // bonus ids
      for (const b of (kv.bonus_id || "").split("/").filter(Boolean))
        if (b.length >= 6) E(`line ${ln}: malformed bonus_id ${b} — six digits, likely two ids run together`);

      if (kv.id === "50040")
        E(`line ${ln}: Distant Land 50040 is the 2-socket variant — page mandates 50695 (3-socket)`);
      if (/howling_rune(?!_\d)/.test(rest))
        E(`line ${ln}: rankless howling_rune fails — use howling_rune_<rank>`);

      // ilevel presence
      if (kv.id && !kv.ilevel && slot !== "shirt" && slot !== "tabard")
        E(`line ${ln}: id=${kv.id} has no ilevel= — drop_level alone is insufficient`);

      // page agreement
      if (onPage && slot !== "shirt" && slot !== "tabard") {
        if (PAIRS[slot]) {
          const key = slot.replace(/[12]$/, "");
          (pairIds[key] = pairIds[key] || []).push({ id: kv.id, ilvl: kv.ilevel, named, ln, slot });
        } else {
          const want = PAGE_SLOT[slot]; const row = rows.find(r => Array.isArray(want) ? want.includes(r.slot) : r.slot === want);
          if (!row) { if (slot !== "off_hand") E(`line ${ln}: no page row for ${slot}`); }
          else {
            if (kv.id && String(row.wowhead) !== kv.id)
              E(`line ${ln}: ${slot} id=${kv.id} but page has ${row.item} (${row.wowhead})`);
            if (kv.ilevel && row.ilvl != null && +kv.ilevel !== row.ilvl)
              E(`line ${ln}: ${slot} ilevel=${kv.ilevel} but page pins ${row.ilvl} for ${row.item}`);
            if (named && row.ilvl != null && kv.ilevel && +kv.ilevel !== row.ilvl)
              E(`line ${ln}: synthetic ${slot} ilevel=${kv.ilevel} but page pins ${row.ilvl}`);
          }
        }
      }

      // proc calibration
      const pm = rest.match(/procby\/attack[^,]*?_(\d+(?:\.\d+)?)(%|ppm)/) ||
                 rest.match(/_(\d+(?:\.\d+)?)(ppm)_/);
      if (pm) {
        const rate = +pm[1], unit = pm[2];
        const sig = Object.keys(CALIBRATIONS).find(s => rest.includes(s));
        if (sig) {
          const cal = CALIBRATIONS[sig];
          const pend = (cal.pending || []).find(p => p.cls === c.id && p.rate === rate);
          const table = unit === "ppm" ? cal.ppm : cal.rates;
          const want = table ? (table[c.id] != null ? table[c.id] : table["*"]) : null;
          if (pend) W(`line ${ln}: ${cal.label} at ${rate}${unit} — ${pend.note}`);
          else if (want == null) W(`line ${ln}: ${cal.label} has no calibration of record for ${c.id}`);
          else if (rate !== want)
            E(`line ${ln}: ${cal.label} at ${rate}${unit} — calibration of record for ${c.id} is ${want}${unit}`);
          const k = `${c.id}|${sig}`;
          if (!seenRates.has(k)) seenRates.set(k, new Map());
          const mm = seenRates.get(k);
          if (!mm.has(rate)) mm.set(rate, []);
          mm.get(rate).push(`${fp}:${ln}`);
        }
      }
    });

    // ring/trinket pairs, order-insensitive
    if (onPage) for (const key of Object.keys(pairIds)) {
      const pageNames = key === "finger" ? ["Ring 1", "Ring 2"] : ["Trinket 1", "Trinket 2"];
      const prows = rows.filter(r => pageNames.includes(r.slot));
      const pids = prows.map(r => String(r.wowhead)).sort();
      const got = pairIds[key];
      const gids = got.filter(g => g.id).map(g => g.id).sort();
      if (gids.length === pids.length && gids.length && gids.join() !== pids.join())
        E(`${key} pair ids [${gids}] differ from page [${pids}] (${prows.map(r => r.item).join(" / ")})`);
      for (const g of got) if (g.id && !pids.includes(g.id))
        E(`line ${g.ln}: ${g.slot} id=${g.id} is not a page ${key} id [${pids}] (${prows.map(r => r.item).join(" / ")})`);
      for (const g of got) if (g.ilvl) {
        const rowMatch = prows.find(r => String(r.wowhead) === g.id) ||
          (got.filter(x => x.ilvl).length === prows.length ? null : null);
        if (rowMatch && rowMatch.ilvl != null && +g.ilvl !== rowMatch.ilvl)
          E(`line ${g.ln}: ${g.slot} ilevel=${g.ilvl} but page pins ${rowMatch.ilvl} for ${rowMatch.item}`);
      }
    }
  }
}

// one spec, one rate — cross-file consistency for each calibrated proc
for (const [k, mm] of seenRates) if (mm.size > 1) {
  const [cid, sig] = k.split("|");
  const cal = CALIBRATIONS[sig];
  const detail = [...mm.entries()].map(([r, ws]) => `${r} @ ${ws.length} file(s)`).join(" vs ");
  const pending = (cal.pending || []).some(p => p.cls === cid);
  (pending ? warns : errs).push(
    `${cid}: ${cal.label} carries different rates across lists (${detail}) — one spec, one calibration${pending ? " (ruling A open)" : ""}`);
}

for (const e of errs) console.log("E  " + e);
for (const w of warns) console.log("W  " + w);
console.log(`\n${errs.length} error(s), ${warns.length} warning(s) across ${files} profile(s)` +
  (ADVISORY && errs.length ? "  [advisory — not gating]" : ""));
process.exit(errs.length && !ADVISORY ? 1 : 0);
