#!/usr/bin/env node
// Validates the compendium data inside index.html, against the project's
// rulings and against the game data in gamedata.json.
//   node validate.js [path/to/index.html]
// Exits 1 on any error so it can gate a build or a pre-commit hook.

const fs = require("fs");

const FILE = process.argv[2] || "index.html";
const HERALD_ILVL_CAP = 41;
// Every listed spec carries all three lists, each fully raid-buffed (since
// 2026-10-22; the self-buffed rail and its Full buffed twin are in list/old).
// An entry with hidden:true is an unlisted preview (ruling D6) and may carry
// any of them.
const LISTS = ["alltime", "obtainable", "herald"];
// Engine of a list's number, off its prov stamp. BracketSim is the engine of
// record since 2026-10-22; a Raidbots number stands, tagged, until its list
// is re-run there.
const engineOf = (c, L) => {
  const p = ((c.prov || {})[L]) || "";
  return /BracketSim/i.test(p) ? "bracketsim" : /Raidbots/i.test(p) ? "raidbots" : "local";
};

// Herald: outside necks, rings and trinkets, every piece comes from Classic,
// TBC or WotLK. The item id decides it, not the source label, which is free
// text. Ids run in order of creation and the last Icecrown Citadel items sit
// just under 52000: of the 24,216 equippable items below that line in the
// game data, all but two stray entries can be worn at level 30. A Wrath item
// with a later id (the Ruby Sanctum's are 53xxx to 54xxx) or an Anniversary
// edition of an old item goes in ERA_ID_OK with the reason it counts.
const ERA_EXEMPT_SLOTS = new Set(["Neck", "Ring 1", "Ring 2", "Trinket 1", "Trinket 2"]);
const HERALD_ERA_LAST_ID = 51999;
const ERA_ID_OK = new Map([
  // [id, "why it counts as Classic, TBC or WotLK"],
]);

// Icecrown Citadel drops at level 30, by difficulty (Standing item decisions
// in PROJECT.md): 10-player heroic 45, 25-player normal 46, 25-player heroic
// 47. gamedata.json tags each drop from its id block and its twin's.
const ICC_ILVL = { "10h": 45, "25n": 46, "25h": 47 };
const ICC_NAME = { "10n": "10-player normal", "10h": "10-player heroic", "25n": "25-player normal", "25h": "25-player heroic" };

const errs = [], warns = [], notes = [];
const err = (m) => errs.push(m);
const warn = (m) => warns.push(m);

// Pull the dataset out of the single-file page and evaluate it, rather than
// regex-parsing the object literals — a real parse means a schema change can't
// silently drift away from what this file checks.
let CLASSES, DEFAULT_SLOTS, CONFIG, html;
try {
  html = fs.readFileSync(FILE, "utf8");
  // Header date must match the newest changelog section: any commit that
  // extends the changelog without touching CONFIG.updated fails.
  {
    const um = html.match(/updated: "(\d{4}-\d{2}-\d{2})"/);
    let clTop = null;
    try {
      const cm = fs.readFileSync(require("path").join(__dirname, "CHANGELOG.txt"), "utf8").match(/^## (\d{4}-\d{2}-\d{2})/m);
      if (cm) clTop = cm[1];
    } catch (e) {}
    if (um && clTop && um[1] !== clTop)
      err(`CONFIG.updated ${um[1]} lags the newest changelog section ${clTop} — the header date updates with every modification`);
  }
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

// ------------------------------------------------------------- game data
// What the client's tables say about every item, gem and enchant spell the
// page names: gamedata.json, cut from SimulationCraft's client data by
// gamedata.js. A row that names an id the file does not hold fails, and the
// message says how to rebuild it.
let GD;
try { GD = require("./gamedata.js").load(); }
catch (e) { console.error(e.message); process.exit(2); }

// What a class can equip. Weapon types are the client's item subclass
// numbers; armour is the heaviest type the class wears. Cloaks are cloth for
// everyone and are not held to the armour type.
const WEAPON = { 0: "one-handed axe", 1: "two-handed axe", 2: "bow", 3: "gun", 4: "one-handed mace",
  5: "two-handed mace", 6: "polearm", 7: "one-handed sword", 8: "two-handed sword", 9: "warglaive",
  10: "staff", 13: "fist weapon", 15: "dagger", 18: "crossbow", 19: "wand" };
const ARMOR = { 1: "cloth", 2: "leather", 3: "mail", 4: "plate" };
const CLASS_RULES = {
  warrior:     { bit: 0x0001, armor: 4, shield: true, weapons: [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 13, 15, 18] },
  paladin:     { bit: 0x0002, armor: 4, shield: true, weapons: [0, 1, 4, 5, 6, 7, 8] },
  hunter:      { bit: 0x0004, armor: 3, weapons: [0, 1, 2, 3, 6, 7, 8, 10, 13, 15, 18] },
  rogue:       { bit: 0x0008, armor: 2, weapons: [0, 4, 7, 13, 15] },
  priest:      { bit: 0x0010, armor: 1, weapons: [4, 10, 15, 19] },
  deathknight: { bit: 0x0020, armor: 4, weapons: [0, 1, 4, 5, 6, 7, 8] },
  shaman:      { bit: 0x0040, armor: 3, shield: true, weapons: [0, 1, 4, 5, 10, 13, 15] },
  mage:        { bit: 0x0080, armor: 1, weapons: [7, 10, 15, 19] },
  warlock:     { bit: 0x0100, armor: 1, weapons: [7, 10, 15, 19] },
  monk:        { bit: 0x0200, armor: 2, weapons: [0, 4, 6, 7, 10, 13] },
  druid:       { bit: 0x0400, armor: 2, weapons: [4, 5, 6, 10, 13, 15] },
  demonhunter: { bit: 0x0800, armor: 2, weapons: [0, 7, 9, 13, 15] },
  evoker:      { bit: 0x1000, armor: 3, weapons: [0, 1, 4, 5, 7, 8, 10, 13, 15] },
};
const classesOf = (mask) => Object.keys(CLASS_RULES).filter((k) => mask & CLASS_RULES[k].bit).join(", ");

// The client's inventory types a page slot accepts. An off hand takes a
// one-handed weapon, an off-hand weapon, a held item or a shield, and a
// two-hander only under Titan's Grip.
const SLOT_INV = {
  "Head": [1], "Neck": [2], "Shoulders": [3], "Back": [16], "Chest": [5, 20], "Wrist": [9],
  "Hands": [10], "Waist": [6], "Legs": [7], "Feet": [8], "Ring 1": [11], "Ring 2": [11],
  "Trinket 1": [12], "Trinket 2": [12],
  "Main Hand": [13, 17, 21, 15, 26], "Off Hand": [13, 22, 23, 14, 17],
};
const TITANS_GRIP = new Set(["warrior"]);   // entry ids: Fury holds a two-hander in each hand
const twoHanded = (it) => it.inv === 17 || ((it.inv === 15 || it.inv === 26) && it.sub !== 19);

// Why an entry's class cannot wear an item in a slot; an empty list means it can.
function equipIssues(it, c, slot) {
  const out = [], rule = CLASS_RULES[c.cls];
  if (!rule) return [`class "${c.cls}" has no line in CLASS_RULES`];
  if (!(SLOT_INV[slot] || []).includes(it.inv))
    out.push(`does not go in the ${slot} slot (the game data gives it inventory type ${it.inv})`);
  if (it.classes && !(it.classes & rule.bit))
    out.push(`is restricted to ${classesOf(it.classes) || "other classes"}`);
  if (it.class === 2 && !rule.weapons.includes(it.sub))
    out.push(`is a ${WEAPON[it.sub] || "weapon of type " + it.sub}, which a ${c.cls} cannot use`);
  if (it.class === 4 && ARMOR[it.sub] && it.inv !== 16 && it.sub > rule.armor)
    out.push(`is ${ARMOR[it.sub]} armour; a ${c.cls} wears up to ${ARMOR[rule.armor]}`);
  if (it.class === 4 && it.sub === 6 && !rule.shield)
    out.push(`is a shield, which a ${c.cls} cannot use`);
  return out;
}

// Gems against sockets (the rule patches 359 and 365 left with no exception).
// A row may show one gem more than its item has sockets only where the lists
// count on a socket: the belt buckle on the waist, and a socket proc on a
// helm, bracers, a neck or a ring, which then wears the Socket Proc badge.
// Necks and rings on All-Time and Full buffed may carry two or three: their
// sockets come from the jeweller's settings, named by bonus id in the profile.
const SOCKET_PROC_SLOTS = new Set(["Head", "Wrist", "Neck", "Ring 1", "Ring 2"]);
const JEWELLERY = new Set(["Neck", "Ring 1", "Ring 2"]);
function socketIssue(r, it, L) {
  const gems = (r.gems || []).reduce((n, g) => n + (g.n || 1), 0);
  const extra = gems - it.sockets;
  const badge = r.hm === "socket";
  if (extra < 0) return `shows ${gems} gem(s) and has ${it.sockets} socket(s) — an empty socket`;
  if (r.slot === "Waist") {
    if (extra > 1) return `shows ${gems} gems on ${it.sockets} socket(s) — the buckle adds one`;
    return badge ? `wears the Socket Proc badge; a belt's extra socket is the buckle` : null;
  }
  if (extra === 1) {
    if (!SOCKET_PROC_SLOTS.has(r.slot)) return `shows ${gems} gem(s) on ${it.sockets} socket(s) — no socket to put it in`;
    return badge ? null : `shows one gem more than its ${it.sockets} socket(s) and has no Socket Proc badge (hm:"socket")`;
  }
  if (badge) return `wears the Socket Proc badge but shows ${gems} gem(s) on ${it.sockets} socket(s) — the badge is for exactly one extra`;
  if (extra > 1 && !(JEWELLERY.has(r.slot) && L === "alltime" && gems <= 3))
    return `shows ${gems} gems on ${it.sockets} socket(s)`;
  return null;
}

// The two tables behind the page's "Professions assumed" line (ruling D2):
// the shoulder inscriptions only a scribe can wear, and the crafted chests
// that bind on pickup. Read from the page so the game data can hold them.
const RUNEFORGING = 960;   // the one skill line on an enchant that is a class's own, not a profession
let SCRIBE_ENCH = null, BOP_CRAFT = null;
try {
  SCRIBE_ENCH = new Function("return " + html.match(/const SCRIBE_ENCH = (new Set\(\[[^\]]*\]\));/)[1])();
  BOP_CRAFT = new Function("return {" + html.match(/const BOP_CRAFT = \{([\s\S]*?)\};/)[1] + "};")();
} catch (e) { err("cannot read SCRIBE_ENCH and BOP_CRAFT from the page"); }

// ---------------------------------------------------------------- config
if (!CONFIG.updated) err("CONFIG.updated is missing");
else if (!/^\d{4}-\d{2}-\d{2}$/.test(CONFIG.updated))
  err(`CONFIG.updated "${CONFIG.updated}" is not YYYY-MM-DD`);
if (/SET ME/i.test(CONFIG.heraldRule || ""))
  err("CONFIG.heraldRule still holds the placeholder text");

// ------------------------------------------------------------ sweep bases
// A row's alternates are measured against a base: the list itself, run beside
// them. altbase holds that reading, and each delta is a percentage of it
// (ruling D30; the S23 runs of 2026-10-12). A list that is re-run and moves
// leaves its alternates on a base it no longer has. By 2026-10-12 that had
// happened to 18 rows without anyone seeing it, and ten more named no base at
// all. So a row that shows a delta carries an altbase within ALT_BASE_TOL DPS
// of its list's number: the raw number on an effective list, since that is
// what a run reports. An unchanged list read within 2 of its stored number on
// every run of S19 to S23; a list that really moves, moves by more.
// ALT_BASE_OLD holds the rows ruled to keep an older sweep. Like the
// item-level exceptions further down, each one is data: it is printed on
// every run, and it fails when its row no longer needs it or when its reason
// says that something is still to be done.
const ALT_BASE_TOL = 3;
const ALT_BASE_OLD = new Map([
  ["warrior/obtainable/Main Hand", "Fury Obtainable, Main Hand: its four alternates keep the sweep of record, on a base of 3384; ruled 2026-10-12 (D31)"],
  ["warrior/obtainable/Off Hand", "Fury Obtainable, Off Hand: its five alternates, the same sweep and ruling (D31)"],
]);
const altBaseOldSeen = new Map();

// ------------------------------------------------------------------ rows
const ilvlById = new Map();

// Builds (2026-10-29): an entry's builds[list] holds alternative builds beside
// the list's number of record - each with dps, prov, talents, stats, rows and
// maybe consumables. Their rows are held to every rule a list's rows are, as
// synthetic entries ("warrior@with-bre") carrying that one list; being
// hidden they owe no other list and no place in the class invariants below.
const BUILD_ENTRIES = [];
for (const c of CLASSES) for (const [L, bs] of Object.entries(c.builds || {})) {
  if (!LISTS.includes(L)) { err(`${c.id}: builds names an unknown list "${L}"`); continue; }
  if (!Array.isArray(bs) || !bs.length) { err(`${c.id}/${L}: builds is not a non-empty array`); continue; }
  if (!(c.buildLabel && c.buildLabel[L])) err(`${c.id}/${L}: carries builds but buildLabel.${L} does not name the record build`);
  const seen = new Set();
  for (const b of bs) {
    const at = `${c.id}/${L}/${b.id}`;
    if (!b.id || !/^[a-z0-9-]+$/.test(b.id)) { err(`${at}: build id must be a lowercase slug`); continue; }
    if (seen.has(b.id)) err(`${at}: duplicate build id`); seen.add(b.id);
    if (!b.label) err(`${at}: build has no label`);
    if (!(Number.isInteger(b.dps) && b.dps > 0)) err(`${at}: build dps must be a positive integer`);
    if (!(b.rows && b.rows.length)) err(`${at}: build has no rows`);
    if (!b.prov) err(`${at}: build has no prov stamp`);
    const cc = c.consumables || {};
    const listCons = (cc.potion || cc.flask || cc.food || cc.oil) ? cc : cc[L];
    BUILD_ENTRIES.push(Object.assign({}, c, { id: `${c.id}@${b.id}`, hidden: true, primary: false,
      lists: { [L]: b.rows || [] }, dpsByList: { [L]: b.dps }, prov: { [L]: b.prov }, talents: { [L]: b.talents },
      stats: { [L]: b.stats }, consumables: { [L]: b.consumables || listCons }, rawByList: undefined, builds: undefined, buildLabel: undefined }));
  }
}

for (const c of CLASSES.concat(BUILD_ENTRIES)) {
  for (const L of LISTS) {
    const rows = (c.lists && c.lists[L]) || [];
    const at = `${c.id}/${L}`;
    if (!rows.length) {
      if (!c.hidden) err(`${at}: list is empty — every listed spec carries all three lists`);
      continue;
    }
    if ((c.dpsByList || {})[L] == null) err(`${at}: the list has rows but no dpsByList number`);

    const slots = new Set(rows.map((r) => r.slot));
    for (const slot of DEFAULT_SLOTS)
      if (slot !== "Off Hand" && !slots.has(slot)) err(`${at}: missing ${slot}`);

    const ids = rows.map((r) => r.wowhead);
    for (const id of new Set(ids)) {
      if (id == null) continue;
      const holders = rows.filter((r) => r.wowhead === id);
      if (holders.length < 2) continue;
      // A dual-wield twin pair — the same non-unique weapon in exactly the
      // Main Hand and Off Hand of one list — is legitimate; anything else
      // duplicated is not.
      const twin = holders.length === 2 &&
        new Set(holders.map((r) => r.slot)).size === 2 &&
        holders.every((r) => r.slot === "Main Hand" || r.slot === "Off Hand");
      if (!twin)
        err(`${at}: ${holders[0].item} (${id}) appears twice`);
    }

    // Hands. A two-handed or ranged main hand leaves no off hand (Titan's
    // Grip aside); a one-handed one needs it filled.
    {
      const mh = rows.find((r) => r.slot === "Main Hand"), oh = rows.find((r) => r.slot === "Off Hand");
      const mi = mh && GD.items[mh.wowhead], oi = oh && GD.items[oh.wowhead];
      const baseId = c.id.replace(/@.*$/, "");   // a build entry answers for its spec
      if (mi && twoHanded(mi) && oh && !TITANS_GRIP.has(baseId))
        err(`${at}: ${mh.item} takes both hands, and the list has an Off Hand row`);
      if (mi && !twoHanded(mi) && !oh)
        err(`${at}: ${mh.item} is one-handed and the list has no Off Hand row`);
      if (oi && oi.inv === 17 && !TITANS_GRIP.has(baseId))
        err(`${at}: ${oh.item} is two-handed and sits in the Off Hand`);
    }

    for (const r of rows) {
      const item = `${r.item} (${r.wowhead})`;

      if (r.ilvl == null) err(`${at}: ${item} has no ilvl`);
      else {
        if (!ilvlById.has(r.wowhead)) ilvlById.set(r.wowhead, new Map());
        const byIlvl = ilvlById.get(r.wowhead);
        if (!byIlvl.has(r.ilvl)) byIlvl.set(r.ilvl, { item: r.item, lists: new Set() });
        byIlvl.get(r.ilvl).lists.add(L);
      }

      if (L === "herald") {
        if (r.ilvl > HERALD_ILVL_CAP)
          err(`${at}: ${item} is ilvl ${r.ilvl}, cap is ${HERALD_ILVL_CAP}`);
        if (!ERA_EXEMPT_SLOTS.has(r.slot) && r.wowhead > HERALD_ERA_LAST_ID && !ERA_ID_OK.has(r.wowhead))
          err(`${at}: ${item} in ${r.slot} is outside Classic/TBC/WotLK by its id (above ${HERALD_ERA_LAST_ID}) — if it is a Wrath or Anniversary item, add it to ERA_ID_OK with the reason`);
      }

      // Ulduar drops have normal and hardmode versions; each needs a decision
      // on record, even if the decision is "normal is fine". All are decided as
      // of the 2026-08-09 pass, so a missing flag is now a hard failure.
      if (/Ulduar/.test(r.source || "") && !r.hm)
        err(`${at}: ${item} is from Ulduar with no hm flag`);

      // hm:"ilvl" was retired; "only" and "socket" are the surviving badges.
      if (r.hm && !["only", "socket", "none"].includes(r.hm))
        err(`${at}: ${item} has unknown hm value "${r.hm}"`);

      // The item itself, against the game data.
      const it = GD.items[r.wowhead];
      if (!it) err(`${at}: ${item} is not in gamedata.json — rebuild it with: node gamedata.js --fetch`);
      else {
        if (it.name !== r.item) err(`${at}: ${r.slot} names "${r.item}" but id ${r.wowhead} is "${it.name}"`);
        if ((r.q || 4) !== it.quality)
          err(`${at}: ${item} has q ${r.q == null ? "unset (epic)" : r.q} but its quality in the game data is ${it.quality}`);
        for (const why of equipIssues(it, c, r.slot)) err(`${at}: ${item} ${why}`);
        if (it.class === 4 && ARMOR[it.sub] && it.inv !== 16 && it.sub < CLASS_RULES[c.cls].armor)
          warn(`${at}: ${item} is ${ARMOR[it.sub]} on a class that wears ${ARMOR[CLASS_RULES[c.cls].armor]} — wearable, but the armour specialization is lost`);
        if (it.skill)
          err(`${at}: ${item} needs a profession to wear (skill line ${it.skill}) and the Professions line does not know it`);
        const sock = socketIssue(r, it, L);
        if (sock) err(`${at}: ${item} ${sock}`);
        if (it.icc && r.ilvl != null) {
          const want = ICC_ILVL[it.icc];
          if (want == null)
            warn(`${at}: ${item} is a ${ICC_NAME[it.icc]} Icecrown drop; no level is on record for those (Wowhead's step is 44)`);
          else if (r.ilvl !== want)
            err(`${at}: ${item} is ilvl ${r.ilvl}; a ${ICC_NAME[it.icc]} Icecrown drop is ${want} at level 30`);
        }
        // Crafted and bind on pickup: only the crafter wears it, and the page
        // has to say so (BOP_CRAFT feeds the badge and the Professions line).
        const crafted = (r.source || "").match(/^Crafted — (.+)$/);
        if (BOP_CRAFT) {
          const prof = BOP_CRAFT[r.wowhead];
          if (crafted && it.bind === 1 && !prof)
            err(`${at}: ${item} is crafted and binds on pickup, and is missing from BOP_CRAFT`);
          if (prof && !(crafted && it.bind === 1))
            err(`${at}: ${item} is in BOP_CRAFT but ${crafted ? "binds on equip in the game data" : `its source is "${r.source}"`}`);
          if (prof && crafted && prof !== crafted[1])
            err(`${at}: ${item} is "${r.source}" but BOP_CRAFT says ${prof}`);
        }
      }
      for (const g of r.gems || []) {
        const gi = GD.items[g.id];
        if (!gi) { err(`${at}: gem ${g.name} (${g.id}) is not in gamedata.json — rebuild it with: node gamedata.js --fetch`); continue; }
        if (gi.class !== 3) err(`${at}: ${item} lists ${gi.name} (${g.id}) as a gem; it is not one`);
        if (gi.name !== g.name) err(`${at}: gem ${g.id} is named "${g.name}" on ${item}; the game data says "${gi.name}"`);
        if ((g.q || 4) !== gi.quality)
          err(`${at}: gem ${gi.name} (${g.id}) on ${item} has q ${g.q == null ? "unset (epic)" : g.q}; its quality is ${gi.quality}`);
      }

      // The enchant label and its link. The link has to be a spell that can
      // put an enchant on this item, and it has to carry the row's name:
      // the feet rows once linked the gloves' Greater Agility, and a Major
      // Spellpower label once linked Major Healing.
      if (!!r.ench !== (r.enchsp != null))
        err(`${at}: ${item} has ${r.ench ? `the enchant "${r.ench}" with no spell id (enchsp)` : `a spell id (enchsp ${r.enchsp}) with no enchant name`}`);
      else if (r.ench) {
        const sp = GD.spells[r.enchsp];
        if (!sp) err(`${at}: enchant spell ${r.enchsp} (${r.ench}) is not in gamedata.json — rebuild it with: node gamedata.js --fetch`);
        else {
          if (sp.name !== r.ench && sp.name !== "Apply " + r.ench)
            err(`${at}: ${item} shows the enchant "${r.ench}" but links spell ${r.enchsp}, "${sp.name}"`);
          if (!sp.enchants.length)
            err(`${at}: ${item}: spell ${r.enchsp} (${sp.name}) applies no enchant in the game data`);
          if (it && sp.invMask && !(sp.invMask & (1 << it.inv)))
            err(`${at}: ${item}: spell ${r.enchsp} (${sp.name}) does not go on this kind of item (${r.slot})`);
          if (it && sp.eqClass && sp.eqClass !== it.class)
            err(`${at}: ${item}: spell ${r.enchsp} (${sp.name}) is for ${sp.eqClass === 2 ? "weapons" : "armour"}, and this is not one`);
          const skills = sp.enchants.map((e) => (GD.enchants[e] || {}).skill).filter(Boolean);
          if (skills.includes(RUNEFORGING) && c.cls !== "deathknight")
            err(`${at}: ${item}: ${r.ench} is a runeforge, and a ${c.cls} cannot make one`);
          const needsProf = skills.some((k) => k !== RUNEFORGING);
          if (SCRIBE_ENCH && needsProf !== SCRIBE_ENCH.has(r.enchsp))
            err(`${at}: ${item}: ${r.ench} ${needsProf ? "needs a profession in the game data and is missing from SCRIBE_ENCH" : "is in SCRIBE_ENCH but needs no profession in the game data"}`);
        }
      }

      // Alternates are items too: same name, quality and wearability rules.
      for (const a of r.alts || [])
        for (const [aid, aname, aq] of [[a.wowhead, a.item, a.q], [a.wowhead2, a.item2, a.q2]]) {
          if (aid == null) continue;
          const ai = GD.items[aid];
          if (!ai) { err(`${at}: alternate ${aname} (${aid}) is not in gamedata.json — rebuild it with: node gamedata.js --fetch`); continue; }
          if (ai.name !== aname) err(`${at}: alternate "${aname}" but id ${aid} is "${ai.name}"`);
          if (aq !== ai.quality) err(`${at}: alternate ${aname} (${aid}) has q ${aq == null ? "unset" : aq}; its quality is ${ai.quality}`);
          for (const why of equipIssues(ai, c, r.slot)) err(`${at}: alternate ${aname} (${aid}) ${why}`);
        }

      // Alternates policy (Fate, 2026-09-30, per Server58's review): a row
      // carries the BiS plus at most TWO alternates. Weapon slots are exempt
      // by the same ruling - their alt ladders ARE the nearest-best weapons
      // and stay however long they need to be.
      if (r.alts && r.alts.length > 2 && !["Main Hand", "Off Hand"].includes(r.slot))
        warn(`${at}: ${item} lists ${r.alts.length} alternates - policy is BiS + 2 on non-weapon slots`);

      // The base the deltas were measured on (see ALT_BASE_TOL above).
      {
        const key = `${c.id}/${L}/${r.slot}`;
        const measured = (r.alts || []).some((a) => a.delta != null);
        const number = (c.rawByList || {})[L] != null ? c.rawByList[L] : (c.dpsByList || {})[L];
        const onBase = Number.isInteger(r.altbase) && number != null && Math.abs(r.altbase - number) <= ALT_BASE_TOL;
        if (r.altbase != null && !(r.alts || []).length)
          err(`${at}: ${item} names a sweep base (altbase ${r.altbase}) and lists no alternate`);
        if (ALT_BASE_OLD.has(key)) altBaseOldSeen.set(key, { measured, onBase });
        else if (measured && r.altbase == null)
          err(`${at}: ${item} shows a delta on its alternates and names no base — altbase is the list's own DPS in the run that measured them`);
        else if (measured && !onBase)
          err(`${at}: ${item}: its alternates were measured against ${r.altbase} and the list is at ${number} — re-read them on the list as it stands (a row ruled to keep an old sweep goes in ALT_BASE_OLD)`);
      }
    }
  }

  // Herald constrains a subset of Obtainable, which constrains a subset of
  // All-Time, so DPS can only fall in that direction.
  const d = c.dpsByList || {};
  const seq = ["herald", "obtainable", "alltime"].filter((k) => d[k] != null);
  const eng = (k) => engineOf(c, k);
  for (let i = 1; i < seq.length; i++)
    if (!(d[seq[i - 1]] <= d[seq[i]])) {
      // A column mid-migration between engines may legitimately invert;
      // adjacent tiers on the same engine must still be monotonic.
      if (eng(seq[i - 1]) === eng(seq[i]))
        err(`${c.id}: DPS not monotonic — ${seq.map((k) => `${k} ${d[k]}`).join(", ")}`);
      else
        warn(`${c.id}: ${seq[i - 1]} ${d[seq[i - 1]]} > ${seq[i]} ${d[seq[i]]} across engines — column mid-migration`);
    }

  // Effective-DPS lists (ruling D4, 2026-10-11). rawByList names the raw sim
  // result behind a number that carries the Vibroblade factor; the page's
  // "effective" tag reads it, and the off-hand note states the same pair. All
  // three must agree, in both directions, or the tag shows a stale raw figure
  // or goes missing from a list whose note says the number is effective.
  for (const [L, raw] of Object.entries(c.rawByList || {})) {
    const at = `${c.id}/${L}`;
    if (!LISTS.includes(L)) { err(`${at}: rawByList names an unknown list`); continue; }
    if (!(Number.isInteger(raw) && raw > 0)) { err(`${at}: rawByList must hold a positive integer`); continue; }
    if (d[L] == null) { err(`${at}: rawByList entry without a dpsByList number`); continue; }
    if (!(raw < d[L])) err(`${at}: raw ${raw} is not below the effective number ${d[L]}`);
    const oh = ((c.lists || {})[L] || []).find((r) => r.slot === "Off Hand");
    const why = (oh && oh.why) || "";
    if (!why.includes(`raw ${raw} x`) || !why.includes(`= ${d[L]}`))
      err(`${at}: off-hand note does not read "raw ${raw} x ... = ${d[L]}" — rawByList, dpsByList and the note must agree`);
  }
  for (const L of LISTS) {
    const oh = ((c.lists || {})[L] || []).find((r) => r.slot === "Off Hand");
    if (oh && /effective DPS: raw \d+ x/.test(oh.why || "") && !(c.rawByList || {})[L])
      err(`${c.id}/${L}: off-hand note states an effective number but rawByList has no entry — the "effective" tag would be missing`);
  }

  for (const L of LISTS) {
    const s = (c.stats || {})[L];
    if (!s) { if ((c.lists || {})[L] && (c.lists || {})[L].length) warn(`${c.id}/${L}: no stats entry`); continue; }
    for (const k of ["main", "stam"])
      if (s[k] == null) err(`${c.id}/${L}: stats.${k} missing`);
    for (const k of ["crit", "mastery", "haste", "vers"])
      if (!Array.isArray(s[k]) || s[k].length !== 2)
        err(`${c.id}/${L}: stats.${k} must be [percent, rating]`);
  }

  for (const L of LISTS) {
    // A list the class does not carry needs no consumables — same shape as
    // the REQUIRED_LISTS carve for emptiness while a tier rolls out.
    if (!(((c.lists || {})[L] || []).length) && !((c.dpsByList || {})[L])) continue;
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
// ILVL_SPLIT_OK holds the ids ruled to exist at more than one level: the
// levels, the lists a level is confined to, and the ruling. An exception is
// an open door, and one hid an open item for two weeks (Abracadaver, whose
// comment said re-runs were pending). So each one is data, not a comment: it
// is printed on every run, it fails when the page shows a level or a list it
// does not name, when the page no longer needs it, and when its reason says
// that something is still to be done.
const ILVL_SPLIT_OK = new Map([
  [178824, { levels: { 33: null, 47: ["alltime"] },
             why: "Signet of the False Accuser: 47 is its Timewalking version, on ten Full buffed lists: Frost DK, Devourer and Shadow (ruled 2026-09-26) and the seven of S24 (D32, 2026-10-12)" }],
  [193676, { levels: { 33: null, 30: ["alltime"] },
             why: "Ukhel Ancestry Beads: Frost DK All-Time ran Asimiir's export at 30 (bonus 13642 in place of 7978), the sim of record on 2026-10-22; Outlaw ran the same error and was re-simmed at 33 on 2026-10-28, which is the fix for the DK as well" }],
  [134487, { levels: { 33: null, 47: ["alltime"] },
             why: "Arch-Druid's Tainted Seal: 47 is its Timewalking version, on nine of the same ten (Fury keeps Fleshfused Circle in Ring 1); the same two rulings" }],
]);
for (const [id, byIlvl] of ilvlById) {
  if (byIlvl.size < 2) continue;
  const name = [...byIlvl.values()][0].item, seen = [...byIlvl.keys()].sort((a, b) => a - b);
  const ok = ILVL_SPLIT_OK.get(id);
  if (!ok) { err(`${name} (${id}): conflicting ilvls ${seen.join(", ")}`); continue; }
  for (const lv of seen) {
    if (!(lv in ok.levels)) { err(`${name} (${id}): ilvl ${lv} is not one of the levels its exception allows (${Object.keys(ok.levels).join(", ")})`); continue; }
    const only = ok.levels[lv];
    const stray = only ? [...byIlvl.get(lv).lists].filter((L) => !only.includes(L)) : [];
    if (stray.length) err(`${name} (${id}): ilvl ${lv} is allowed on ${only.join(", ")} only, and shows on ${stray.join(", ")}`);
  }
}
for (const [id, ok] of ILVL_SPLIT_OK) {
  const byIlvl = ilvlById.get(id);
  if (!byIlvl || byIlvl.size < 2) err(`ILVL_SPLIT_OK still lists ${id}, which the page no longer shows at two levels — remove the exception`);
  if (/pending|re-?run|until|to do|todo|tbd|await/i.test(ok.why)) err(`ILVL_SPLIT_OK ${id}: the reason says something is still open ("${ok.why}") — an exception needs a ruling, not a promise`);
  notes.push(`item-level exception in force: ${ok.why} (${id}; levels ${Object.keys(ok.levels).join(" and ")})`);
}

for (const [key, why] of ALT_BASE_OLD) {
  const seen = altBaseOldSeen.get(key);
  if (!seen) err(`ALT_BASE_OLD lists ${key}, which is not a row of the page — remove the exception`);
  else if (!seen.measured) err(`ALT_BASE_OLD still lists ${key}, which shows no delta any more — remove the exception`);
  else if (seen.onBase) err(`ALT_BASE_OLD still lists ${key}, whose base is its list's number again — remove the exception`);
  if (/pending|re-?run|until|to do|todo|tbd|await/i.test(why)) err(`ALT_BASE_OLD ${key}: the reason says something is still open ("${why}") — an exception needs a ruling, not a promise`);
  notes.push(`sweep-base exception in force: ${why} (${key})`);
}

// ---------------------------------------------------------------- report
const rows = CLASSES.reduce((n, c) =>
  n + LISTS.reduce((m, L) => m + ((c.lists && c.lists[L]) || []).length, 0), 0);

// The entry-level dps field is the All-Time number. Only the sort uses it as
// a tiebreak, which is how it went stale twice without anyone seeing.
for (const c of CLASSES)
  if (c.dps !== (c.dpsByList || {}).alltime)
    err(`${c.id}: dps ${c.dps} is not dpsByList.alltime ${(c.dpsByList || {}).alltime}`);

// The page states how many specs and classes it lists in two descriptions
// (and on the share image assets/og.png, which no script reads).
{
  const listed = CLASSES.filter((c) => !c.hidden);
  const nSpecs = listed.length, nClasses = new Set(listed.map((c) => c.cls)).size;
  for (const [what, re] of [["meta description", /<meta name="description" content="([^"]*)"/],
                            ["og:description", /<meta property="og:description" content="([^"]*)"/]]) {
    const m = html.match(re);
    if (!m) { err(`${what} not found on the page`); continue; }
    const sp = m[1].match(/(\d+) specs/), cl = m[1].match(/(\d+) classes/);
    if (!sp) warn(`${what} states no spec count ("N specs") — nothing to hold to the ${nSpecs} listed`);
    else if (+sp[1] !== nSpecs)
      err(`${what} says "${sp[0]}"; the page lists ${nSpecs} — the share image assets/og.png states the count too`);
    if (cl && +cl[1] !== nClasses)
      err(`${what} says "${cl[0]}"; the page lists ${nClasses}`);
  }
}

// Multi-spec invariants: unique entry ids, a class key on every entry,
// exactly one primary per class (the ruling the "Best" view renders).
{
  const ids = CLASSES.map((c) => c.id);
  if (new Set(ids).size !== ids.length) err("duplicate entry ids");
  const per = {};
  for (const c of CLASSES) {
    if (!c.cls) err(`${c.id}: missing cls (class key)`);
    if (c.primary != null && typeof c.primary !== "boolean") err(`${c.id}: primary must be boolean`);
    per[c.cls] = (per[c.cls] || 0) + (c.primary ? 1 : 0);
  }
  for (const k of Object.keys(per))
    if (per[k] !== 1) err(`class ${k}: ${per[k]} primary entries (must be exactly 1)`);
}

// Main stat of record: what each entry's stats panel must label its primary
// stat, keyed by entry id (spec truth — a class fallback is not good enough:
// Havoc is Agility under an Intellect Devourer class, Balance is Intellect
// under an Agility Feral class). The page resolves PRIMARY[id] || PRIMARY[cls];
// this check re-runs that resolution against the table, so a new entry with
// no line here, or one that resolves through the wrong fallback, fails the
// build instead of rendering the wrong stat name.
const MAIN_STAT = {
    warrior: "Strength", warrior_arms: "Strength",
    paladin: "Strength",
    deathknight: "Strength", deathknight_unholy: "Strength",
    hunter: "Agility", hunter_survival: "Agility", hunter_beast_mastery: "Agility",
    druid: "Agility", druid_balance: "Intellect",
    rogue: "Agility", rogue_assassination: "Agility", rogue_subtlety: "Agility",
    monk: "Agility",
    demonhunter: "Intellect", demonhunter_havoc: "Agility",
    mage: "Intellect", mage_fire: "Intellect", mage_arcane: "Intellect",
    shaman: "Intellect", shaman_elemental: "Intellect", shaman_enhancement: "Agility",
    priest: "Intellect",
    warlock: "Intellect", warlock_demonology: "Intellect", warlock_destruction: "Intellect",
    evoker: "Intellect", evoker_augmentation: "Intellect",
};
{
  let pagePrimary = null;
  try {
    const src = fs.readFileSync(FILE, "utf8");
    const m = src.match(/const PRIMARY = \{([\s\S]*?)\};/);
    if (m) pagePrimary = new Function("return {" + m[1] + "};")();
  } catch (e) {}
  if (!pagePrimary) err("cannot extract the PRIMARY main-stat map from the page");
  else for (const c of CLASSES) {
    const expected = MAIN_STAT[c.id];
    if (!expected) { err(`${c.id}: no main stat of record — add it to MAIN_STAT in validate.js`); continue; }
    const resolved = pagePrimary[c.id] || pagePrimary[c.cls];
    if (resolved !== expected)
      err(`${c.id}: stats panel labels the main stat "${resolved}" but the spec's stat is ${expected}`);
  }
}

// Weapon buffs on the Consumables panel (P8, ruled 2026-10-11). A melee list
// is one whose spec's stat is Strength or Agility and whose main hand is not
// a bow, gun or crossbow. Its Full buffed sim bakes a stone into each weapon,
// so its Full buffed panel has to list a weapon buff. On any panel a buff is
// listed for a hand that holds a weapon, and a stone fits the weapon it goes
// on: a Sharpening Stone on an edge (sword, axe, dagger, polearm, warglaive),
// a Weightstone on a blunt weapon (mace, fist weapon, staff).
{
  const EDGED = new Set([0, 1, 6, 7, 8, 9, 15]), BLUNT = new Set([4, 5, 10, 13]);
  const STONE = { 23529: [EDGED, "an edged weapon"], 28421: [BLUNT, "a blunt weapon"] };
  const hands = (o) => !o ? [] : (o.mh || o.oh) ? [o.mh && ["Main Hand", o.mh], o.oh && ["Off Hand", o.oh]].filter(Boolean)
    : !o.item ? [] : o.hands === "MH/OH" ? [["Main Hand", o], ["Off Hand", o]] : [["Main Hand", o]];
  for (const c of CLASSES.concat(BUILD_ENTRIES))
    for (const L of LISTS) {
      const rows = (c.lists || {})[L] || [];
      if (!rows.length) continue;
      const cc = c.consumables;
      const cons = !cc ? null : (cc.potion || cc.flask || cc.food || cc.oil) ? cc : cc[L];
      const held = (slot) => { const r = rows.find((x) => x.slot === slot); return r ? GD.items[r.wowhead] : null; };
      const mh = held("Main Hand");
      const melee = ["Strength", "Agility"].includes(MAIN_STAT[c.id.replace(/@.*$/, "")]) && mh && mh.class === 2 && ![2, 3, 18].includes(mh.sub);
      const listed = hands(cons && cons.oil);
      // A fully buffed list sims its weapon buff, so a melee list's panel names
      // one. A Raidbots number carried on Obtainable or Herald was simmed
      // self-buffed, with the weapon buff disabled (ruling D3): exempt.
      // A shaman's weapons carry its own imbues, which a stone cannot share:
      // Enhancement's BracketSim profile runs temporary_enchant=disabled and
      // its panel lists no stone (2026-10-28).
      if (melee && !listed.length && c.cls !== "shaman" && (L === "alltime" || engineOf(c, L) === "bracketsim"))
        err(`${c.id}/${L}: a melee fully buffed list sims a weapon stone, and its Consumables panel lists no weapon buff`);
      for (const [slot, e] of listed) {
        const it = held(slot), st = STONE[e.wowhead];
        if (!it || it.class !== 2) err(`${c.id}/${L}: the Consumables panel lists ${e.item} for the ${slot}, which holds no weapon`);
        else if (st && !st[0].has(it.sub)) err(`${c.id}/${L}: the Consumables panel lists ${e.item} for the ${slot}, a ${WEAPON[it.sub]} — it goes on ${st[1]}`);
      }
    }
}

// One item at one level has one id. A raid drop's normal and heroic versions
// share a name and differ in level, so the same name at the same level under
// two ids means some rows link the wrong version: six druid rows showed the
// normal Umbrage Armbands at the heroic's 47 until 2026-10-11. Alternates
// carry no level and are not compared. TWIN_OK is for a real pair that does
// share a level (a faction twin): "name @level" -> why.
{
  const TWIN_OK = new Map();
  const seen = new Map();
  for (const c of CLASSES)
    for (const L of LISTS)
      for (const r of (c.lists || {})[L] || []) {
        if (!r.item || r.wowhead == null || r.ilvl == null) continue;
        const k = `${r.item} @${r.ilvl}`;
        if (!seen.has(k)) seen.set(k, new Map());
        const ids = seen.get(k);
        if (!ids.has(r.wowhead)) ids.set(r.wowhead, []);
        ids.get(r.wowhead).push(`${c.id}/${L}/${r.slot}`);
      }
  for (const [k, ids] of seen) {
    if (ids.size < 2) { if (TWIN_OK.has(k)) err(`TWIN_OK lists "${k}", which the page links under one id — remove the entry`); continue; }
    if (TWIN_OK.has(k)) { notes.push(`${k} is linked under ${ids.size} ids — ${TWIN_OK.get(k)}`); continue; }
    const [name, lvl] = k.split(" @");
    const parts = [...ids].sort((a, b) => b[1].length - a[1].length)
      .map(([id, at]) => `${id} on ${at.length} row${at.length > 1 ? "s" : ""} (${at.slice(0, 2).join(", ")}${at.length > 2 ? ", …" : ""})`);
    err(`${name} is shown at ilvl ${lvl} under ${ids.size} ids: ${parts.join("; ")} — two versions of an item do not share a level, so one of these links the wrong version`);
  }
  for (const k of TWIN_OK.keys()) if (!seen.has(k)) err(`TWIN_OK lists "${k}", which is on no row — remove the entry`);
}

if (notes.length) {
  console.log("");
  for (const n of notes) console.log("  i", n);
}
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
