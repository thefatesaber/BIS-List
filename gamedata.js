#!/usr/bin/env node
// Game data for the two gates. gamedata.json holds, for every item, gem,
// enchant and enchant spell the page or a list profile names, what the game
// client's tables say about it: name, quality, type, sockets, class
// restriction, and which enchant a spell applies. validate.js and
// lint_profiles.js read that file; this script writes it.
//
//   node gamedata.js <simc checkout>   rebuild from a local SimulationCraft tree
//   node gamedata.js --fetch [ref]     rebuild from GitHub (simulationcraft/simc);
//                                      ref defaults to the branch on file
//   node gamedata.js --check           exit 1 if the page or a profile names an
//                                      id the file does not hold
//
// The source is SimulationCraft's generated client data (engine/dbc/generated),
// the same tables the sims run on. Run a rebuild whenever a row or a profile
// line brings in an id the file has not seen; the gates fail until then, and
// say so.

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const FILE = path.join(ROOT, "gamedata.json");
const LIST_DIRS = ["All-time", "Obtainable", "Herald"];
const GEAR_LINE = /^(head|neck|shoulders?|back|chest|shirt|tabard|wrists?|hands|waist|legs|feet|finger[12]|trinket[12]|main_hand|off_hand)=/;
const TABLES = ["item_data.inc", "sc_spell_data.inc", "spell_item_enchantment.inc", "item_bonus.inc"];

// Enchant spells the game data cannot resolve, read by hand. Each names the
// enchant ids the spell applies and where that was read.
const MANUAL_SPELLS = {
  60582: { name: "Icescale Leg Armor", enchants: [3823],
           manual: "not in SimulationCraft's spell data; read on Wowhead 2026-10-11" },
  59937: { name: "Lesser Inscription of the Storm", enchants: [3810],
           manual: "not in SimulationCraft's spell data; spell_item_enchantment.inc names 59937 as the spell of enchant 3810 (Sons of Hodir, honored); read 2026-10-22" },
};

// Spell effects that put an enchant on an item, misc value = enchant id.
const ENCHANT_EFFECTS = new Set([53, 54, 92, 156]);
const CRAFT_ENCHANT_EFFECT = 301;   // profession-quality enchants: no id on the effect
const BONUS_SOCKET = 6;             // item_bonus type: adds value_1 sockets
const FLAG_HEROIC = 0x8;            // item flags_1: "Heroic" on the tooltip

// Icecrown Citadel raid drops, by id block (PROJECT.md, Standing item
// decisions). Heroic-flag items sit in two blocks; each has a normal twin of
// the same name outside them.
const ICC_25H = [50600, 50799], ICC_10H = [51800, 51999], ICC_NORMAL = [49900, 51999];

function load() {
  let d;
  try { d = JSON.parse(fs.readFileSync(FILE, "utf8")); }
  catch (e) { throw new Error(`cannot read gamedata.json (${e.message}) — rebuild it with: node gamedata.js --fetch`); }
  return d;
}

// ------------------------------------------------------------ what is named
function pageData(file) {
  const html = fs.readFileSync(file, "utf8");
  const blocks = html.match(/<script>([\s\S]*?)<\/script>/g) || [];
  const code = blocks.sort((a, b) => b.length - a.length)[0]
    .replace(/^<script>/, "").replace(/<\/script>$/, "");
  const cut = code.search(/^(const|let|function)\s+\$\s*=|^function whLink/m);
  return new Function((cut > 0 ? code.slice(0, cut) : code) + "\nreturn { CLASSES };")();
}

// Every id the page and the list profiles name, by kind.
function wanted(root) {
  const w = { items: new Set(), spells: new Set(), enchants: new Set(), bonus: new Set() };
  const { CLASSES } = pageData(path.join(root, "index.html"));
  for (const c of CLASSES)
    for (const rows of Object.values(c.lists || {}))
      for (const r of rows || []) {
        if (r.wowhead != null) w.items.add(+r.wowhead);
        if (r.enchsp != null) w.spells.add(+r.enchsp);
        for (const g of r.gems || []) if (g.id != null) w.items.add(+g.id);
        for (const a of r.alts || []) {
          if (a.wowhead != null) w.items.add(+a.wowhead);
          if (a.wowhead2 != null) w.items.add(+a.wowhead2);
        }
      }
  for (const dir of LIST_DIRS) {
    const d = path.join(root, "list", dir);
    let names = [];
    try { names = fs.readdirSync(d).filter(f => f.endsWith(".txt") || f.endsWith(".simc")); } catch (e) {}
    for (const f of names)
      for (const line of fs.readFileSync(path.join(d, f), "utf8").split(/\r?\n/)) {
        if (!GEAR_LINE.test(line)) continue;
        const kv = {};
        for (const p of line.slice(line.indexOf("=") + 1).split(",")) {
          const j = p.indexOf("="); if (j > 0) kv[p.slice(0, j)] = p.slice(j + 1);
        }
        if (/^\d+$/.test(kv.id || "")) w.items.add(+kv.id);
        if (/^\d+$/.test(kv.enchant_id || "")) w.enchants.add(+kv.enchant_id);
        for (const g of (kv.gem_id || "").split("/")) if (/^\d+$/.test(g) && +g) w.items.add(+g);
        for (const b of (kv.bonus_id || "").split("/")) if (/^\d+$/.test(b)) w.bonus.add(+b);
      }
  }
  return w;
}

// Ids the page or a profile names that gamedata.json does not hold.
function missing(root, data) {
  const w = wanted(root), out = [];
  for (const id of w.items) if (!data.items[id]) out.push(`item ${id}`);
  for (const id of w.spells) if (!data.spells[id]) out.push(`enchant spell ${id}`);
  for (const id of w.enchants) if (!data.enchants[id]) out.push(`enchant ${id}`);
  return out;
}

// ------------------------------------------------------------- the tables
// One table row -> [name or null, numeric fields in order]. Braces only group.
function fields(line) {
  let s = line.trim();
  if (!s.startsWith("{")) return null;
  s = s.replace(/\/\*.*?\*\//g, "");
  let name = null;
  const q = s.match(/^\{\s*"((?:[^"\\]|\\.)*)"\s*,/);
  if (q) { name = q[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\"); s = s.slice(q[0].length); }
  const tail = s.match(/,\s*"((?:[^"\\]|\\.)*)"\s*\}\s*,?\s*$/);
  let last = null;
  if (tail) { last = tail[1].replace(/\\"/g, '"'); s = s.slice(0, s.length - tail[0].length); }
  const nums = s.replace(/[{}]/g, " ").split(",").map(t => t.trim()).filter(t => t !== "");
  return { name, last, nums };
}
const num = t => /^0x/i.test(t) ? Number(BigInt(t) & 0xffffffffn) : parseFloat(t);

function build(read, source, root) {
  const w = wanted(root);
  const out = { source, items: {}, enchants: {}, spells: {}, socketBonus: {} };

  // items: name, id, flags_1, flags_2, type_flags, level, req_level, req_skill,
  // req_skill_level, quality, inventory_type, class, subclass, bind_type,
  // delay, dmg_range, modifier, &stats, stats_count, class_mask, race_mask,
  // socket_color[3], ...
  const all = new Map();               // id -> raw, for the twins lookup
  const byName = new Map();
  let build_no = null;
  for (const line of read("item_data.inc").split("\n")) {
    if (!build_no) { const b = line.match(/wow build (?:level )?([\d.]+)/); if (b) build_no = b[1]; }
    const f = fields(line);
    if (!f || f.name == null || f.nums.length < 24) continue;
    const n = f.nums.map(num);
    const it = { name: f.name, id: n[0], flags: n[1], reqLevel: n[5], skill: n[6], quality: n[8],
                 inv: n[9], class: n[10], sub: n[11], bind: n[12], classMask: n[18],
                 sockets: [n[20], n[21], n[22]].filter(x => x > 0).length };
    all.set(it.id, it);
    if (it.inv && it.id >= ICC_NORMAL[0] && it.id <= ICC_10H[1]) {
      if (!byName.has(it.name)) byName.set(it.name, []);
      byName.get(it.name).push(it);
    }
  }
  if (!all.size) throw new Error("item_data.inc: no rows parsed — the table layout has changed");
  const iccOf = it => {
    if (!it.inv) return null;
    const heroic = !!(it.flags & FLAG_HEROIC);
    const within = (r) => it.id >= r[0] && it.id <= r[1];
    if (heroic && within(ICC_25H)) return "25h";
    if (heroic && within(ICC_10H)) return "10h";
    if (heroic || !within(ICC_NORMAL)) return null;
    const twins = (byName.get(it.name) || []).filter(t => t.id !== it.id && (t.flags & FLAG_HEROIC));
    if (twins.some(t => t.id >= ICC_25H[0] && t.id <= ICC_25H[1])) return "25n";
    if (twins.some(t => t.id >= ICC_10H[0] && t.id <= ICC_10H[1])) return "10n";
    return null;
  };
  for (const id of [...w.items].sort((a, b) => a - b)) {
    const it = all.get(id);
    if (!it) continue;
    const o = { name: it.name, quality: it.quality, class: it.class, sub: it.sub, inv: it.inv,
                sockets: it.sockets, bind: it.bind, reqLevel: it.reqLevel };
    // A class mask naming every class, or none, is no restriction.
    const m = it.classMask & 0x1fff;
    if (m && m !== 0x1fff) o.classes = m;
    if (it.skill) o.skill = it.skill;
    if (it.flags & FLAG_HEROIC) o.heroic = true;
    const icc = iccOf(it);
    if (icc) o.icc = icc;
    out.items[id] = o;
  }

  // enchants: id, gem, scaling, min/max scaling level, min/max ilevel,
  // req_skill, req_skill_value, type[3], amount[3], prop[3], coeff[3], spell, name
  const enchByName = new Map();
  const enchAll = new Map();
  for (const line of read("spell_item_enchantment.inc").split("\n")) {
    const f = fields(line);
    if (!f || f.last == null || f.nums.length < 9) continue;
    const n = f.nums.map(num);
    // Profession-quality enchants carry their tier as an icon in the name.
    const tier = f.last.match(/\|A:Professions-ChatIcon-Quality-Tier(\d)/);
    const name = f.last.replace(/\s*\|A:.*$/, "").trim();
    // [21] the spell that applies the enchant, by the table's own column
    const e = { id: n[0], name, skill: n[7], tier: tier ? +tier[1] : 0, spell: n[21] > 0 ? n[21] : 0 };
    enchAll.set(e.id, e);
    if (e.tier) { if (!enchByName.has(name)) enchByName.set(name, []); enchByName.get(name).push(e.id); }
  }
  if (!enchAll.size) throw new Error("spell_item_enchantment.inc: no rows parsed — the table layout has changed");
  // An enchant a profile sims is wanted with the spell that applies it, so
  // a page row can link that spell before any row does (rebase_list.js).
  for (const id of w.enchants) { const e = enchAll.get(id); if (e && e.spell) w.spells.add(e.spell); }

  // spells, then their effects, from one file.
  // spell: name, id, ..., [34] equipped_class, [35] equipped_invtype_mask
  // effect: id, spell_id, index, type, subtype, ..., [15] base_value, [16] misc_value
  const spellRows = new Map(), effects = new Map();
  let part = "";
  for (const line of read("sc_spell_data.inc").split("\n")) {
    if (/^static /.test(line)) {
      part = line.includes("__spell_data[") ? "spell" : line.includes("__spelleffect_data[") ? "effect" : "";
      continue;
    }
    if (part === "spell") {
      const m = line.match(/^\s*\{\s*"((?:[^"\\]|\\.)*)"\s*,\s*(\d+)\s*,/);
      if (!m || !w.spells.has(+m[2])) continue;
      const f = fields(line), n = f.nums;
      spellRows.set(+m[2], { name: f.name, eqClass: num(n[34]), invMask: num(n[35]) });
    } else if (part === "effect") {
      const m = line.match(/^\s*\{\s*\d+\s*,\s*(\d+)\s*,/);
      if (!m || !w.spells.has(+m[1])) continue;
      const n = fields(line).nums.map(num);
      if (!effects.has(n[1])) effects.set(n[1], []);
      effects.get(n[1]).push({ type: n[3], misc: n[16] });
    }
  }
  for (const id of [...w.spells].sort((a, b) => a - b)) {
    if (MANUAL_SPELLS[id]) { out.spells[id] = MANUAL_SPELLS[id]; continue; }
    const s = spellRows.get(id);
    if (!s) continue;
    const effs = effects.get(id) || [];
    let ench = effs.filter(e => ENCHANT_EFFECTS.has(e.type)).map(e => e.misc);
    // A crafted-quality enchant names no id on its effect: the enchants that
    // carry the spell's name, one per quality tier, are what it can apply.
    if (!ench.length && effs.some(e => e.type === CRAFT_ENCHANT_EFFECT))
      ench = enchByName.get(s.name) || [];
    const o = { name: s.name, enchants: [...new Set(ench)].sort((a, b) => a - b) };
    if (s.eqClass > 0 && s.eqClass !== 0xffffffff) o.eqClass = s.eqClass;
    if (s.invMask) o.invMask = s.invMask;
    out.spells[id] = o;
  }

  const enchIds = new Set(w.enchants);
  for (const s of Object.values(out.spells)) for (const e of s.enchants) enchIds.add(e);
  for (const id of [...enchIds].sort((a, b) => a - b)) {
    const e = enchAll.get(id);
    if (!e) continue;
    const o = { name: e.name };
    if (e.skill) o.skill = e.skill;
    if (e.spell) o.spell = e.spell;
    out.enchants[id] = o;
  }

  // bonus ids that add sockets: entry id, bonus id, type, value_1, ...
  let bonusRows = 0;
  for (const line of read("item_bonus.inc").split("\n")) {
    const f = fields(line);
    if (!f || f.nums.length < 4) continue;
    bonusRows++;
    const n = f.nums.map(num);
    if (n[2] === BONUS_SOCKET && n[3] > 0) out.socketBonus[n[1]] = (out.socketBonus[n[1]] || 0) + n[3];
  }
  if (!bonusRows) throw new Error("item_bonus.inc: no rows parsed — the table layout has changed");

  if (build_no) out.source.build = build_no;
  selfTest(out, all);
  return out;
}

// Facts the project has established by other means. If the tables' layout
// moves, a column shift shows here before it reaches a check.
function selfTest(out, all) {
  const bad = [];
  const want = (ok, what) => { if (!ok) bad.push(what); };
  const it = id => all.get(id) || {};
  want(it(19334).name === "The Untamed Blade" && it(19334).class === 2 && it(19334).sub === 8 && it(19334).inv === 17 && it(19334).quality === 4,
       "The Untamed Blade (19334) is an epic two-handed sword");
  want(it(30122).name === "Destroyer Shoulderblades" && (it(30122).classMask & 0x1fff) === 1, "Destroyer Shoulderblades (30122) is warrior-only");
  want(it(34708).sockets === 0 && it(34708).inv === 16, "Cloak of the Coming Night (34708) is a cloak with no socket");
  want(it(50641).sockets === 1 && it(49982).sockets === 0, "Heartpierce: the heroic (50641) has one socket, the normal (49982) none");
  want(it(50695).sockets === 3 && it(50040).sockets === 2, "Distant Land: 50695 has three sockets, 50040 two");
  want(!!(it(51887).flags & FLAG_HEROIC) && !(it(50966).flags & FLAG_HEROIC), "Abracadaver: 51887 carries the heroic flag, 50966 does not");
  want(it(34377).bind === 1 && it(30032).bind === 2, "Hard Khorium Battleplate (34377) binds on pickup, Red Belt of Battle (30032) on equip");
  want(it(40395).class === 2 && it(40395).sub === 4, "Torch of Holy Fire (40395) is a one-handed mace");
  const sp = out.spells;
  if (sp[20023]) want(sp[20023].enchants.includes(1887) && sp[20023].invMask === 1 << 8, "spell 20023 (Greater Agility) puts enchant 1887 on boots");
  if (sp[389410]) want(sp[389410].enchants.includes(6625), "spell 389410 (Waking Stats) resolves to enchant 6625 by name");
  if (out.enchants[3835]) want(out.enchants[3835].skill > 0, "enchant 3835 (Master's Inscription of the Axe) requires a profession");
  want(out.socketBonus[8780] === 1 && out.socketBonus[8782] === 3 && out.socketBonus[10879] === 2, "bonus ids 8780, 8782 and 10879 add 1, 3 and 2 sockets");
  if (bad.length) throw new Error("game data self-test failed — the table layout has probably changed:\n  " + bad.join("\n  "));
}

// One item per line, so a rebuild shows as the rows that moved.
function serialize(d) {
  const sec = (o) => "{\n" + Object.keys(o).map(k => `    ${JSON.stringify(k)}: ${JSON.stringify(o[k])}`).join(",\n") + "\n  }";
  return "{\n" +
    `  "source": ${JSON.stringify(d.source)},\n` +
    `  "items": ${sec(d.items)},\n` +
    `  "enchants": ${sec(d.enchants)},\n` +
    `  "spells": ${sec(d.spells)},\n` +
    `  "socketBonus": ${JSON.stringify(d.socketBonus)}\n` +
    "}\n";
}

// ------------------------------------------------------------------- CLI
async function main() {
  const args = process.argv.slice(2);
  if (!args.length || args.includes("--help")) {
    console.log("usage: node gamedata.js <simc checkout> | --fetch [ref] | --check");
    process.exit(args.length ? 0 : 2);
  }
  if (args[0] === "--check") {
    const miss = missing(ROOT, load());
    if (miss.length) {
      console.error(`gamedata.json does not hold ${miss.length} id(s) the page or a profile names:\n  ` + miss.join("\n  "));
      console.error("rebuild it with: node gamedata.js --fetch");
      process.exit(1);
    }
    console.log("gamedata.json holds every id the page and the list profiles name");
    return;
  }

  let read, source;
  if (args[0] === "--fetch") {
    let prev = {};
    try { prev = load().source || {}; } catch (e) {}
    const repo = "simulationcraft/simc";
    const ref = args[1] || prev.ref || "midnight";
    const get = async (url, as) => {
      const r = await fetch(url, { headers: { "User-Agent": "legacy-thirty-bis" } });
      if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
      return as === "json" ? r.json() : r.text();
    };
    // The ref names a commit: a hash as given, a branch through git or, failing
    // that, GitHub's API. The tables are then read at that one commit.
    let commit = /^[0-9a-f]{7,40}$/.test(ref) ? ref : null;
    if (!commit) try {
      const out = require("child_process").execSync(`git ls-remote https://github.com/${repo}.git "${ref}"`,
        { stdio: ["ignore", "pipe", "ignore"] }).toString();
      commit = (out.match(/^[0-9a-f]{40}/m) || [null])[0];
    } catch (e) {}
    if (!commit) commit = (await get(`https://api.github.com/repos/${repo}/commits/${encodeURIComponent(ref)}`, "json")).sha;
    const cache = {};
    for (const t of TABLES) {
      process.stderr.write(`fetching ${t} at ${commit.slice(0, 7)}\n`);
      cache[t] = await get(`https://raw.githubusercontent.com/${repo}/${commit}/engine/dbc/generated/${t}`);
    }
    read = t => cache[t];
    source = { repo, ref, commit: commit.slice(0, 7) };
  } else {
    let dir = args[0];
    if (fs.existsSync(path.join(dir, "engine", "dbc", "generated"))) dir = path.join(dir, "engine", "dbc", "generated");
    read = t => fs.readFileSync(path.join(dir, t), "utf8");
    source = { repo: "simulationcraft/simc" };
    try {
      const top = path.resolve(dir, "..", "..", "..");
      const cp = require("child_process");
      const git = c => cp.execSync(`git -C "${top}" ${c}`, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
      source.ref = git("rev-parse --abbrev-ref HEAD");
      source.commit = git("rev-parse --short=7 HEAD");
    } catch (e) {}
  }

  const data = build(read, source, ROOT);
  const miss = missing(ROOT, data);
  fs.writeFileSync(FILE, serialize(data));
  console.log(`gamedata.json: ${Object.keys(data.items).length} items, ${Object.keys(data.enchants).length} enchants, ` +
    `${Object.keys(data.spells).length} enchant spells, ${Object.keys(data.socketBonus).length} socket bonus ids` +
    ` (${source.repo}${source.commit ? " " + source.commit : ""}${data.source.build ? ", build " + data.source.build : ""})`);
  if (miss.length) {
    console.error(`not in the game data (${miss.length}):\n  ` + miss.join("\n  "));
    console.error("An enchant spell the tables do not carry needs a line in MANUAL_SPELLS, with where it was read.");
    process.exit(1);
  }
}

module.exports = { load, missing, wanted, LIST_DIRS };
if (require.main === module) main().catch(e => { console.error(e.message); process.exit(2); });
