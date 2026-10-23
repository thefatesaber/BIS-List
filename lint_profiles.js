#!/usr/bin/env node
// Lints the .simc benchmark profiles against the page dataset and the
// standing profile rulings.
//   node lint_profiles.js [--advisory] [--page index.html] <dir> [<dir>...]
// Exits 1 on errors unless --advisory is given. CI runs it without the flag
// on the three list folders, so an error blocks.
//
// Two kinds of profile sit in a list folder since 2026-10-22. A BracketSim
// profile (".simc", header "Engine of record : BracketSim") is the export the
// site's Advanced tab ran: native items, no proxies, its own hotfix layer.
// It is held to the page - filename DPS, talents, every gear line against
// its row - and to nothing of the Raidbots house style below. A ".txt"
// profile is a Raidbots-era file still of record on Obtainable or Herald,
// and carries every rule below until its list is re-run.
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
//  - every profile carries a temporary_enchant= line with a value:
//    "disabled" off the Full buffed list, the buff or "disabled" on it
//  - page and profile agree line by line: item id, item level (proxy lines
//    included), gems (rings and trinkets included) and enchant; an enchant
//    agrees when the spell the page links applies the profile's enchant id
//  - Crusader is simmed as a ring proc: one ring per weapon row that shows it,
//    and no enchant_id=1900 on a weapon line
//  - a line's socket bonus ids add up to its gems
//  - a list that wears the Helm and Pauldrons of Desolation carries the set's
//    2-piece on its head line: enchant=12crit (15 on Survival Full buffed)
//  - any other head token is the crit of a Full buffed list's weapon stones,
//    3 a stone, or it is no proxy on record
//  - a line leaves no socket of its item empty

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const ADVISORY = args.includes("--advisory");
let PAGE = "index.html";
const pi = args.indexOf("--page");
if (pi >= 0) { PAGE = args[pi + 1]; args.splice(pi, 2); }
const DIRS = args.filter(a => a !== "--advisory");
if (!DIRS.length) { console.error("usage: node lint_profiles.js [--advisory] [--page index.html] <dir>..."); process.exit(2); }

// ---------------------------------------------------------------- game data
// gamedata.json, rebuilt by gamedata.js: what the client's tables say about
// the items, gems and enchants the profiles name.
let GD;
try { GD = require("./gamedata.js").load(); }
catch (e) { console.error(e.message); process.exit(2); }
const REBUILD = "is not in gamedata.json - rebuild it with: node gamedata.js --fetch";

// Crusader (enchant 1900) creates nothing in SimC: the lists sim it as a proc
// on a ring, one ring per weapon that wears it (Standing item decisions).
const CRUSADER_ENCHANT = 1900, CRUSADER_RING = "37str_15dur";

// The Desolation set (660) is missing from the engine's set-bonus registry, so
// a list that wears the Helm and the Pauldrons carries the 2-piece on its head
// line (PROJECT.md, "Head is the proxy slot"). 12 crit rating is the tooltip at
// level 30, read in game by Fate on 2026-10-12; Wowhead's says 13 and is not
// the bracket's. One list writes more: Survival Full buffed bakes the 3 crit of
// its weapon stone into the same token. Until 2026-10-12 nothing held this:
// Restoration's four lists had no token and Elemental's four carried 13.
const DESOLATION = { head: "28192", shoulder: "27713", token: "12crit",
                     withStone: { "hunter_survival/alltime": "15crit" } };

// The other head token on record is the crit of a melee Full buffed list's
// weapon stones, 3 a stone (PROJECT.md, D16 and D17), and the page names the
// stones in that list's Consumables panel. A head token is one of those two
// or it stands for nothing. Until 2026-10-12 nothing held that: four warlock
// heads carried enchant=1sp for a Felweave 2-piece the set does not have
// (ruling D33), and the token had come back once after being taken off by
// hand.
const STONES = new Set([23529, 28421]), STONE_CRIT = 3;
const stonesOn = (c, list) => {
  const cons = c.consumables || {};
  const oil = (cons[list] || cons).oil;       // per list, or one panel for every list
  if (!oil) return 0;
  if (oil.wowhead != null) return STONES.has(oil.wowhead) ? String(oil.hands || "MH").split("/").length : 0;
  return ["mh", "oh"].filter(h => oil[h] && STONES.has(oil[h].wowhead)).length;
};

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
  if (/full.?buff/.test(b)) return null;            // list/old only: not a list of record
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

// Calibrations of record, keyed by the proc's stat signature and then by
// spec: the page entry's id (warrior is Fury, deathknight is Frost, rogue is
// Outlaw, monk is Windwalker, paladin is Retribution). One spec, one
// encoding, in one unit: each was solved until the sim realizes the proc's
// anchor in procs a minute (PROJECT.md, Proc calibrations). A spec with no
// entry fails. Until 2026-10-11 the table was keyed by class and a missing
// entry only warned, which is how four specs ran for weeks on an encoding
// copied from another: Arms on Fury's number in the wrong unit, Havoc and
// Enhancement on Windwalker's, Unholy on Frost's. `pending` marks a spread
// that awaits a ruling: warned, not failed.
const CALIBRATIONS = {
  "103haste_10dur_20cd": { label: "Dragonspine Trophy", rates: { "*": 3.2 } },
  "97str_8dur":          { label: "The Untamed Blade", rates: { warrior: 3.7, warrior_arms: 18.2, paladin: 19.6 } },
  "51crit_10dur_3stack": { label: "Bonereaver's Edge", rates: { warrior: 9.8, deathknight: 8.6, deathknight_unholy: 20.9 } },
  "281haste_10dur":      { label: "The Jackhammer", rates: { warrior: 2.5 } },
  "184haste_5dur":       { label: "Eskhandar's Right Claw", ppm: { monk: 0.88, rogue: 0.4, demonhunter_havoc: 0.63, shaman_enhancement: 0.41 } },
  "37str_15dur":         { label: "Crusader (ring encoding)", rates: { warrior: 3.0, warrior_arms: 3.0, paladin: 16.2 } },
};

const errs = [], warns = [];
let files = 0;
const seenRates = new Map(); // `${spec}|${sig}` -> Map(rate -> [where])

const tokenizeName = s => (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

for (const dir of DIRS) {
  const list = LIST_OF_DIR(dir);
  if (!list) { warns.push(`${dir}: not a benchmark list directory — skipped`); continue; }
  let names;
  try { names = fs.readdirSync(dir).filter(f => f.endsWith(".txt") || f.endsWith(".simc")); }
  catch (e) { errs.push(`${dir}: ${e.message}`); continue; }

  for (const fname of names.sort()) {
    if (fname === "CHANGES.txt") continue;
    files++;
    const fp = path.join(dir, fname);
    const E = m => errs.push(`${fp}: ${m}`);
    const W = m => warns.push(`${fp}: ${m}`);
    const text = fs.readFileSync(fp, "utf8");
    const lines = text.split(/\r?\n/);
    const has = re => lines.some(l => re.test(l));
    const where = re => lines.map((l, i) => re.test(l) ? i + 1 : 0).filter(Boolean);
    const BS = /^#\s*Engine of record\s*:\s*BracketSim/m.test(text);
    if (BS !== fname.endsWith(".simc"))
      E(BS ? `a BracketSim profile is a .simc file` : `a .simc file carries the BracketSim header ("# Engine of record : BracketSim")`);

    // -------- filename: "<dps> - <Class> <Spec>.txt|.simc", space or underscore
    const m = fname.match(/^(\d+)\s*-\s*(.+)\.(txt|simc)$/);
    if (!m) { E(`filename does not parse as "<dps> - <Class> <Spec>.txt" or ".simc"`); continue; }
    const fdps = +m[1];
    const words = m[2].replace(/_/g, " ").trim();
    const cls = [...new Set(CLASSES.map(c => c.name))].sort((a, b) => b.length - a.length)
      .find(n => words.toLowerCase().startsWith(n.toLowerCase()));
    if (!cls) { E(`no class matches "${words}"`); continue; }
    const specName = words.slice(cls.length).trim();
    // Prefix-tolerant spec match ("Devour" vs "Devourer"), resolved among
    // every entry of the class — a class may carry several spec entries.
    const specStr = x => typeof x.spec === "string" ? x.spec : (x.spec && (x.spec.alltime || Object.values(x.spec)[0])) || "";
    const specHit = x => specName && specStr(x) &&
      (specStr(x).toLowerCase() === specName.toLowerCase() ||
       specStr(x).toLowerCase().startsWith(specName.toLowerCase()));
    const cands = CLASSES.filter(x => x.name === cls);
    const c = cands.find(specHit) || cands[0];
    const onPage = cands.some(specHit);
    if (!onPage) {
      // Off-page spec files are archived frozen artifacts (e.g. a tier not
      // yet published for a spec) — no checks.
      continue;
    }
    if (!((c.lists || {})[list])) continue; // tier not published for this entry — archived file
    const survival = c.cls === "hunter" && /^surv/i.test(specStr(c));

    const rows = onPage ? (c.lists || {})[list] || [] : [];
    if (onPage && fdps !== (c.dpsByList || {})[list])
      E(`filename dps ${fdps} != page dpsByList.${list} ${(c.dpsByList || {})[list]}`);
    // The page's prov stamp names the engine the file ran on.
    const prov = ((c.prov || {})[list]) || "";
    if (onPage && BS !== /BracketSim/i.test(prov))
      E(`page prov.${list} reads "${prov}" and the profile is ${BS ? "" : "not "}a BracketSim export`);
    if (BS) {
      // A BracketSim profile: the page agreement checks below apply, the
      // Raidbots house-style rulings do not.
      const t = lines.find(l => /^talents=/.test(l));
      const pageT = (c.talents || {})[list];
      if (t && pageT && t.slice(8) !== pageT) E(`talents string differs from page talents.${list}`);
      if (!has(/^augmentation=disabled/)) E(`augmentation=disabled missing - the export sets it; a blank field falls back to an augment rune`);
      lintGear({ fp, c, list, rows, lines, onPage, E, W, bracketsim: true });
      continue;
    }

    // -------- whole-file rulings (Raidbots-era profiles)

    for (const n of where(/^external_buffs\.pool=/))
      if (list !== "alltime") // the buffed tier IS externally buffed
        E(`line ${n}: external_buffs pool — external buffs are out; the rail is self-buffed`);
    for (const n of where(/^actions[^#]*invoke_external_buff/))
      if (list !== "alltime") // the buffed tier IS externally buffed
        E(`line ${n}: invoke_external_buff — external buffs are out; the rail is self-buffed`);
    if ((c.cls || c.id) !== "priest")
      for (const n of where(/^actions[^#]*\/power_infusion\b(?!_)/))
        E(`line ${n}: power_infusion cast on a non-priest — not their kit; the rail is own-kit-only`);
    for (const n of where(/^override\.spell_data=spell\.10060\./))
      if ((c.cls || c.id) !== "priest" || lines[n - 1].trim() !== "override.spell_data=spell.10060.spell_level=1")
        E(`line ${n}: spell 10060 override — the PI level-gate relaxation is sanctioned on priest profiles only, and only as spell_level=1`);
    for (const n of where(/^enemy_custom_health_timeline/))
      E(`line ${n}: health timeline enabled — standby only, keep commented`);
    if (!has(/^#\s*enemy_custom_health_timeline/) && !has(/^enemy_custom_health_timeline/))
      W(`standby line "#enemy_custom_health_timeline=20:0.2" missing`);
    for (const n of where(/^target_level=\+/))
      E(`line ${n}: target_level=+N parses as absolute level N — use target_level+=N`);
    for (const n of where(/^target_level=(\d|1[0-9])$/))
      E(`line ${n}: absolute target_level below 20 — level-3-boss bug`);
    // A Raidbots-era file on All-Time is a Full buffed one (the self-buffed
    // rail's sanctioned exception, PROJECT.md): external buffs and live
    // consumables are the tier's point, so the two rail checks below don't
    // apply to it.
    if (list !== "alltime" && (c.cls || c.id) !== "hunter" && has(/^override\.hunters_mark=1/))
      E(`hunters_mark=1 — the hunter's own permanent debuff; on a non-hunter it assumes an actor the rail excludes`);
    if (list !== "alltime" && !has(/^temporary_enchant=disabled/)) E(`temporary_enchant=disabled missing`);
    // Full buffed sims its weapon buff, so the line names one or says
    // "disabled" - but it has to be there. With no line the druid and evoker
    // modules add an oil of their own (Feral Full buffed, 87 DPS, until
    // 2026-10-11).
    if (list === "alltime" && !has(/^temporary_enchant=\S/))
      E(`no temporary_enchant= line - name the weapon buff or write temporary_enchant=disabled; with no line the class module may add its own`);
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

    lintGear({ fp, c, list, rows, lines, onPage, E, W, bracketsim: false });
  }
}


// ---------------------------------------------------------------- gear lines
// Every gear line against the page: the row with its id, at its item level,
// with its gems and its enchant. The Raidbots house-style rulings (nameless
// id lines, proxies and their calibrations, the Desolation head token, the
// Crusader ring) are skipped on a BracketSim profile.
function lintGear({ fp, c, list, rows, lines, onPage, E, W, bracketsim }) {
  // -------- gear lines
  const seenSlot = {};
  const pairIds = {};                       // "finger"/"trinket" -> [{id,ilvl,ln}]
  const gear = [];                          // every line that should have a page row
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
    if (bracketsim) { /* the export names every item; nothing is synthetic */ }
    else if (named && kv.id)
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
      if (g === "76885" && c.id === "shaman")
        E(`line ${ln}: meta 76885 in a Restoration export — ruling is Mystical Skyfire Diamond 25893`);
    }

    // bonus ids
    for (const b of (kv.bonus_id || "").split("/").filter(Boolean))
      if (b.length >= 6) E(`line ${ln}: malformed bonus_id ${b} — six digits, likely two ids run together`);

    if (kv.id === "50040")
      E(`line ${ln}: Distant Land 50040 is the 2-socket variant — page mandates 50695 (3-socket)`);
    if (rest.includes("108haste_10dur_20cd"))
      E(`line ${ln}: Dragonspine payload 108 — the tooltip is 103; use 103haste_10dur_20cd_3.2%`);
    if (/howling_rune(?!_\d)/.test(rest))
      E(`line ${ln}: rankless howling_rune fails — use howling_rune_<rank>`);

    // ilevel presence
    if (!bracketsim && kv.id && !kv.ilevel && slot !== "shirt" && slot !== "tabard")
      E(`line ${ln}: id=${kv.id} has no ilevel= — drop_level alone is insufficient`);

    // page agreement: find the row here, compare below once every line is read
    if (onPage && slot !== "shirt" && slot !== "tabard") {
      const g = { slot, ln, kv, named, rest, row: null };
      gear.push(g);
      if (PAIRS[slot]) {
        const key = slot.replace(/[12]$/, "");
        (pairIds[key] = pairIds[key] || []).push({ id: kv.id, ilvl: kv.ilevel, named, ln, slot, g });
      } else {
        const want = PAGE_SLOT[slot]; const row = rows.find(r => Array.isArray(want) ? want.includes(r.slot) : r.slot === want);
        if (!row) { if (slot !== "off_hand") E(`line ${ln}: no page row for ${slot}`); }
        else {
          g.row = row;
          if (kv.id && String(row.wowhead) !== kv.id)
            E(`line ${ln}: ${slot} id=${kv.id} but page has ${row.item} (${row.wowhead})`);
          if (kv.ilevel && row.ilvl != null && +kv.ilevel !== row.ilvl)
            E(`line ${ln}: ${named ? "synthetic " : ""}${slot} ilevel=${kv.ilevel} but page pins ${row.ilvl} for ${row.item}`);
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
        const pend = (cal.pending || []).find(p => p.spec === c.id && p.rate === rate);
        const pick = t => t ? (t[c.id] != null ? t[c.id] : t["*"]) : null;
        const table = unit === "ppm" ? cal.ppm : cal.rates;
        const want = pick(table), other = pick(unit === "ppm" ? cal.rates : cal.ppm);
        if (pend) W(`line ${ln}: ${cal.label} at ${rate}${unit} — ${pend.note}`);
        else if (want == null && other != null)
          E(`line ${ln}: ${cal.label} at ${rate}${unit} — the calibration of record for ${c.id} is ${other}${unit === "ppm" ? "%" : "ppm"}, in the other unit`);
        else if (want == null)
          E(`line ${ln}: ${cal.label} has no calibration of record for ${c.id} — an encoding is solved per spec, not copied from another`);
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

  // the Desolation pair carries its 2-piece on the head line (a Raidbots
  // profile: BracketSim's build holds the set bonus itself)
  if (!bracketsim) {
    const dh = gear.find(g => g.slot === "head"), ds = gear.find(g => g.slot === "shoulder");
    if (dh && ds && dh.kv.id === DESOLATION.head && ds.kv.id === DESOLATION.shoulder) {
      const want = DESOLATION.withStone[`${c.id}/${list}`] || DESOLATION.token;
      if (dh.kv.enchant !== want)
        E(`line ${dh.ln}: the Helm and Pauldrons of Desolation are worn and the head line carries ` +
          `${dh.kv.enchant ? "enchant=" + dh.kv.enchant : "no enchant= token"} — the 2-piece proxy of record is enchant=${want}`);
    } else if (dh && /^\d+[a-z_]+$/.test(dh.kv.enchant || "")) {
      // any other head token: the crit of this list's weapon stones, or nothing
      const n = list === "alltime" ? stonesOn(c, list) : 0;
      if (!n)
        E(`line ${dh.ln}: head carries enchant=${dh.kv.enchant}, which is no proxy on record — a head token stands for the Desolation 2-piece ` +
          `or for the crit of a Full buffed list's weapon stones, and this list has neither`);
      else if (dh.kv.enchant !== `${STONE_CRIT * n}crit`)
        E(`line ${dh.ln}: head carries enchant=${dh.kv.enchant}; the page names ${n} weapon stone(s) for this list, ` +
          `so the token of record is enchant=${STONE_CRIT * n}crit`);
    }
  }

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
    // Which page row a ring or trinket line stands for: the row with its
    // id; for a proxy, the row whose name the proxy's name starts with
    // (dragonspine_trophy_proxy, meteorite_crystal_macro_proxy); and when
    // one line and one row are left, each other.
    const left = prows.slice();
    const take = (g, r) => { g.g.row = r; left.splice(left.indexOf(r), 1); };
    for (const g of got) { const r = g.id && left.find(r => String(r.wowhead) === g.id); if (r) take(g, r); }
    for (const g of got) {
      if (g.g.row || g.id || !g.named) continue;
      const r = left.find(r => g.named.startsWith(tokenizeName(r.item)));
      if (r) take(g, r);
    }
    const open = got.filter(g => !g.g.row && !g.id);
    if (open.length === 1 && left.length === 1) take(open[0], left[0]);
    for (const g of got)
      if (!g.g.row && !g.id) W(`line ${g.ln}: cannot tell which page ${key} row ${g.named || g.slot} stands for - its level, gems and enchant are not compared`);
    for (const g of got) if (g.ilvl && g.g.row && g.g.row.ilvl != null && +g.ilvl !== g.g.row.ilvl)
      E(`line ${g.ln}: ${g.named ? "synthetic " : ""}${g.slot} ilevel=${g.ilvl} but page pins ${g.g.row.ilvl} for ${g.g.row.item}`);
  }

  // -------- line against row: gems, enchant, sockets
  let crusaderRows = 0, crusaderRings = 0;
  for (const g of gear) {
    const { slot, ln, kv, rest, row } = g;
    const gems = (kv.gem_id || "").split("/").filter(x => x && x !== "0");
    const eid = /^\d+$/.test(kv.enchant_id || "") ? +kv.enchant_id : null;
    if (rest.includes(CRUSADER_RING)) crusaderRings++;

    // every id the line names has to be in the game data
    const it = kv.id ? GD.items[kv.id] : null;
    if (kv.id && !it) E(`line ${ln}: item ${kv.id} ${REBUILD}`);
    for (const x of new Set(gems)) {
      if (!GD.items[x]) E(`line ${ln}: gem ${x} ${REBUILD}`);
      else if (GD.items[x].class !== 3) E(`line ${ln}: gem_id ${x} is ${GD.items[x].name}, which is not a gem`);
    }
    if (eid != null && !GD.enchants[eid]) E(`line ${ln}: enchant ${eid} ${REBUILD}`);

    // Socket bonus ids are labels to the engine, which counts the gems; the
    // lists keep them true all the same: the item's own sockets plus the
    // bonus ids' have to be the gems on the line.
    const bonusSockets = (kv.bonus_id || "").split("/").reduce((n, b) => n + (GD.socketBonus[b] || 0), 0);
    if (bonusSockets && it && it.sockets + bonusSockets !== gems.length)
      E(`line ${ln}: ${slot} carries ${gems.length} gem(s) on ${it.sockets} socket(s) plus ${bonusSockets} from its bonus ids`);
    // No socket of the item is left empty. The engine grants an item its
    // socket bonus whatever its sockets hold (PROJECT.md, Socket bonuses),
    // so an empty one would be counted by the sim and not by the game. More
    // gems than the item has sockets is not an error here: a belt buckle, a
    // socket proc and a jeweller's setting add sockets no bonus id names.
    else if (it && gems.length < it.sockets)
      E(`line ${ln}: ${slot} leaves a socket empty: ${gems.length} gem(s) on the ${it.sockets} socket(s) of ${it.name}`);

    if (!row) continue;

    // Gems: the same ones, as many times, as the page row shows - rings and
    // trinkets included, and also when one side shows none.
    const page = (row.gems || []).flatMap(x => Array(x.n || 1).fill(String(x.id))).sort().join("/");
    if (gems.slice().sort().join("/") !== page)
      E(`line ${ln}: ${slot} gems [${gems.join("/") || "none"}] disagree with the page row ${row.item} [${page || "none"}]`);

    // Enchant: the spell the page links has to apply the enchant the line
    // sims. Through the spell, because several spells apply one enchant
    // (gloves and boots both give 1887) and the page links the right one
    // for the slot. A head line's enchant=<stat> token is a proxy, not an
    // enchant, and the page shows nothing for it.
    const sp = row.enchsp != null ? GD.spells[row.enchsp] : null;
    if (row.enchsp != null && !sp) { E(`line ${ln}: enchant spell ${row.enchsp} (${row.ench}) ${REBUILD}`); continue; }
    if (sp && sp.enchants.includes(CRUSADER_ENCHANT)) {
      crusaderRows++;
      if (bracketsim) {       // native: the weapon line carries enchant_id=1900
        if (eid !== CRUSADER_ENCHANT) E(`line ${ln}: page shows Crusader on ${row.item}; the ${slot} line sims enchant ${eid == null ? "none" : eid} - a BracketSim profile carries enchant_id=${CRUSADER_ENCHANT}`);
        continue;
      }
      if (eid != null)
        E(`line ${ln}: ${slot} carries enchant_id=${eid} under a Crusader row - Crusader is simmed on a ring, and enchant_id=1900 creates nothing in SimC`);
      continue;
    }
    const ename = eid != null && GD.enchants[eid] ? ` (${GD.enchants[eid].name})` : "";
    if (row.ench && eid == null)
      E(`line ${ln}: page shows ${row.ench} on ${row.item}; the ${slot} line has no enchant_id`);
    else if (!row.ench && eid != null)
      E(`line ${ln}: ${slot} sims enchant ${eid}${ename}; the page row ${row.item} shows no enchant`);
    else if (sp && !sp.enchants.includes(eid))
      E(`line ${ln}: page shows ${row.ench} on ${row.item} (spell ${row.enchsp}, enchant ${sp.enchants.join("/") || "none"}); the ${slot} line sims enchant ${eid}${ename}`);
  }
  if (!bracketsim && onPage && crusaderRows !== crusaderRings)
    E(`page shows Crusader on ${crusaderRows} weapon row(s) and the profile sims its proc on ${crusaderRings} ring(s) - one ring (${CRUSADER_RING}) per weapon that wears it`);
}

// one spec, one rate — cross-file consistency for each calibrated proc
for (const [k, mm] of seenRates) if (mm.size > 1) {
  const [cid, sig] = k.split("|");
  const cal = CALIBRATIONS[sig];
  const detail = [...mm.entries()].map(([r, ws]) => `${r} @ ${ws.length} file(s)`).join(" vs ");
  const pending = (cal.pending || []).some(p => p.spec === cid);
  (pending ? warns : errs).push(
    `${cid}: ${cal.label} carries different rates across lists (${detail}) — one spec, one calibration${pending ? " (ruling A open)" : ""}`);
}

for (const e of errs) console.log("E  " + e);
for (const w of warns) console.log("W  " + w);
console.log(`\n${errs.length} error(s), ${warns.length} warning(s) across ${files} profile(s)` +
  (ADVISORY && errs.length ? "  [advisory — not gating]" : ""));
process.exit(errs.length && !ADVISORY ? 1 : 0);
