#!/usr/bin/env node
// Validates the compendium data inside index.html.
//   node validate.js [path/to/index.html]
// Exits 1 on any error so it can gate a build or a pre-commit hook.

const fs = require("fs");

const FILE = process.argv[2] || "index.html";
const HERALD_ILVL_CAP = 41;
const LISTS = ["alltime", "obtainable", "herald"];

// Necks, rings and trinkets are exempt from the Classic/TBC/WotLK source rule.
const ERA_EXEMPT_SLOTS = new Set(["Neck", "Ring 1", "Ring 2", "Trinket 1", "Trinket 2"]);

// Sources that satisfy the Herald era restriction, matched as substrings.
const ERA_OK = [
  "Molten Core", "Blackwing", "Naxxramas", "Ahn'Qiraj", "Zul'Gurub", "Onyxia",
  "Blackrock", "Scholomance", "Stratholme", "Dire Maul", "Gnomeregan",
  "Sunken Temple", "Uldaman", "Maraudon", "Anniversary",
  "Karazhan", "Gruul", "Magtheridon", "Serpentshrine", "Tempest Keep", "Hyjal",
  "Black Temple", "Sunwell", "Zul'Aman", "Magisters", "Mechanar", "Botanica",
  "Arcatraz", "Shattered Halls", "Shadow Labyrinth", "Steamvault", "Slave Pens",
  "Underbog", "Mana-Tombs", "Auchenai", "Sethekk", "Old Hillsbrad",
  "Black Morass", "Blood Furnace", "Ramparts", "Durnholde",
  "Ulduar", "Icecrown", "Trial of the Crusader", "Eye of Eternity",
  "Obsidian Sanctum", "Vault of Archavon", "Ruby Sanctum", "Utgarde", "Nexus",
  "Azjol", "Ahn'kahet", "Drak'Tharon", "Gundrak", "Oculus", "Culling",
  "Violet Hold", "Forge of Souls", "Pit of Saron", "Halls of", "Dalaran",
  "Crafted", "World", "PvP", "Quest", "Vendor",
];

const errs = [], warns = [];
const err = (m) => errs.push(m);
const warn = (m) => warns.push(m);
const eraOk = (src) => ERA_OK.some((k) => (src || "").includes(k));

// Pull the dataset out of the single-file page and evaluate it, rather than
// regex-parsing the object literals — a real parse means a schema change can't
// silently drift away from what this file checks.
let CLASSES, DEFAULT_SLOTS, CONFIG;
try {
  const html = fs.readFileSync(FILE, "utf8");
  const blocks = html.match(/<script>([\s\S]*?)<\/script>/g) || [];
  if (!blocks.length) throw new Error("no inline <script> found");
  const code = blocks.sort((a, b) => b.length - a.length)[0]
    .replace(/^<script>/, "").replace(/<\/script>$/, "");
  // Stop before anything that touches document/window.
  const cut = code.search(/^(const|let|function)\s+\$\s*=|^function whLink/m);
  const data = cut > 0 ? code.slice(0, cut) : code;
  ({ CLASSES, DEFAULT_SLOTS, CONFIG } = new Function(
    data + "\nreturn { CLASSES, DEFAULT_SLOTS, CONFIG };")());
} catch (e) {
  console.error(`cannot read data from ${FILE}: ${e.message}`);
  process.exit(2);
}

// ---------------------------------------------------------------- config
if (!CONFIG.updated) err("CONFIG.updated is missing");
else if (!/^\d{4}-\d{2}-\d{2}$/.test(CONFIG.updated))
  err(`CONFIG.updated "${CONFIG.updated}" is not YYYY-MM-DD`);
if (/SET ME/i.test(CONFIG.heraldRule || ""))
  err("CONFIG.heraldRule still holds the placeholder text");

// ------------------------------------------------------------------ rows
const ilvlById = new Map();

for (const c of CLASSES) {
  for (const L of LISTS) {
    const rows = (c.lists && c.lists[L]) || [];
    const at = `${c.id}/${L}`;
    if (!rows.length) { err(`${at}: list is empty`); continue; }

    const slots = new Set(rows.map((r) => r.slot));
    for (const slot of DEFAULT_SLOTS)
      if (slot !== "Off Hand" && !slots.has(slot)) err(`${at}: missing ${slot}`);

    const ids = rows.map((r) => r.wowhead);
    for (const id of new Set(ids))
      if (id != null && ids.filter((x) => x === id).length > 1)
        err(`${at}: ${(rows.find((r) => r.wowhead === id) || {}).item} (${id}) appears twice`);

    for (const r of rows) {
      const item = `${r.item} (${r.wowhead})`;

      if (r.ilvl == null) err(`${at}: ${item} has no ilvl`);
      else {
        if (!ilvlById.has(r.wowhead)) ilvlById.set(r.wowhead, new Map());
        ilvlById.get(r.wowhead).set(r.ilvl, r.item);
      }

      if (L === "herald") {
        if (r.ilvl > HERALD_ILVL_CAP)
          err(`${at}: ${item} is ilvl ${r.ilvl}, cap is ${HERALD_ILVL_CAP}`);
        if (!ERA_EXEMPT_SLOTS.has(r.slot) && !eraOk(r.source))
          err(`${at}: ${item} in ${r.slot} from "${r.source}" — outside Classic/TBC/WotLK`);
      }

      // Ulduar drops have normal and hardmode versions; each needs a decision
      // on record, even if the decision is "normal is fine".
      if (/Ulduar/.test(r.source || "") && !r.hm)
        warn(`${at}: ${item} is from Ulduar with no hm flag`);

      // hm:"ilvl" renders as "ilvl X -> Y HM", so it needs both numbers.
      if (r.hm === "ilvl" && r.ilvlNormal == null)
        err(`${at}: ${item} has hm:"ilvl" but no ilvlNormal`);

      if (r.alts && r.alts.length && !r.why)
        warn(`${at}: ${item} lists alternates but has no why note`);
    }
  }

  // Herald constrains a subset of Obtainable, which constrains a subset of
  // All-Time, so DPS can only fall in that direction.
  const d = c.dpsByList || {};
  if (!(d.herald <= d.obtainable && d.obtainable <= d.alltime))
    err(`${c.id}: DPS not monotonic — alltime ${d.alltime}, obtainable ${d.obtainable}, herald ${d.herald}`);

  for (const L of LISTS) {
    const s = (c.stats || {})[L];
    if (!s) { warn(`${c.id}/${L}: no stats entry`); continue; }
    for (const k of ["main", "stam"])
      if (s[k] == null) err(`${c.id}/${L}: stats.${k} missing`);
    for (const k of ["crit", "mastery", "haste", "vers"])
      if (!Array.isArray(s[k]) || s[k].length !== 2)
        err(`${c.id}/${L}: stats.${k} must be [percent, rating]`);
  }

  for (const L of LISTS) {
    const cc = c.consumables;
    const cons = !cc ? null
      : (cc.potion || cc.flask || cc.food || cc.oil) ? cc : cc[L];
    if (!cons) { warn(`${c.id}/${L}: no consumables`); continue; }
    for (const k of ["potion", "flask", "food"])
      if (!cons[k] || !cons[k].item) err(`${c.id}/${L}: consumables.${k} missing`);
  }
}

// One item id carries one item level. Catches a drop entered at different
// ilvls on different specs, and normal/heroic pairs that share a display name.
for (const [id, byIlvl] of ilvlById)
  if (byIlvl.size > 1)
    err(`${[...byIlvl.values()][0]} (${id}): conflicting ilvls ${[...byIlvl.keys()].sort((a, b) => a - b).join(", ")}`);

// ---------------------------------------------------------------- report
const rows = CLASSES.reduce((n, c) =>
  n + LISTS.reduce((m, L) => m + ((c.lists && c.lists[L]) || []).length, 0), 0);

if (warns.length) {
  console.log(`\n${warns.length} warning(s):`);
  for (const w of warns) console.log("  ~", w);
}
if (errs.length) {
  console.error(`\n${errs.length} error(s):`);
  for (const e of errs) console.error("  x", e);
  console.error(`\nFAILED — ${rows} rows checked`);
  process.exit(1);
}
console.log(`\nPASSED — ${rows} rows, ${CLASSES.length} specs, ${LISTS.length} lists`);
