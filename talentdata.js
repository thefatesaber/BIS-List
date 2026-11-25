#!/usr/bin/env node
// Talent trees for the page. assets/talents.js holds, for every class, the
// order of its tree nodes (what a talent string is read against) and, for the
// rows a level-30 character can reach, each talent's place, spell, name and
// icon, and the lines that leave it. The page reads a list's talent string against it and draws the build.
// This script writes that file.
//
//   node talentdata.js --fetch [ref]            rebuild from GitHub and Raidbots
//   node talentdata.js <trait_data.inc> <dir> [talents.json]
//                                               rebuild from local copies: the
//                                               SimulationCraft table, WoWAnalyzer's
//                                               src/common/TALENTS and, optionally,
//                                               Raidbots' talents.json
//   node talentdata.js --check [index.html]     read every talent string on the
//                                               page against the file; exit 1 if
//                                               one does not read as a legal
//                                               level-30 build of its spec
//
// Sources: SimulationCraft's generated client data (trait_data.inc: node ids,
// ranks, spells, which spec sees what), WoWAnalyzer's talent tables (icon
// names) and Raidbots' talents.json (https://www.raidbots.com/static/data/live/
// talents.json: where the game draws each talent, the lines between talents,
// and which are active abilities). When Raidbots cannot be reached, the places
// and lines already in assets/talents.js are carried over, and the run says so;
// a talent with no place on file is left out and named.
// Rebuild after a game patch that changes a tree; --check says when one has.

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const FILE = path.join(ROOT, "assets", "talents.js");
const CLASS_POINTS = 11, SPEC_POINTS = 10;      // talent points at level 30
const WA_FILES = ["deathknight", "demonhunter", "druid", "evoker", "hunter", "mage", "monk",
                  "paladin", "priest", "rogue", "shaman", "warlock", "warrior"];

// ------------------------------------------------------------------ sources
function parseTraits(txt) {
  const build = (txt.match(/wow build ([\d.]+)/) || [])[1] || "";
  const re = /\{\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(-?\d+),\s*(-?\d+),\s*(-?\d+),\s*"((?:[^"\\]|\\.)*)",\s*\{([^}]*)\},\s*\{([^}]*)\},\s*(\d+),\s*(\d+)\s*\}/g;
  const out = []; let m;
  while ((m = re.exec(txt))) out.push({
    tree: +m[1], cls: +m[2], entry: +m[3], node: +m[4], max: +m[5], req: +m[6], spell: +m[8],
    row: +m[11], col: +m[12], sel: +m[13], name: m[14].replace(/\\(.)/g, "$1"),
    specs: m[15].split(",").map(Number).filter(Boolean),
  });
  if (!out.length) throw new Error("no trait rows read: the table's layout has changed");
  return { build, traits: out };
}

// Icon names WoWAnalyzer's tables spell differently from Wowhead's icon
// server, each read there on 2026-11-25: the name on the left answers 404.
const ICON_FIX = {
  ability_rogue_shuriken_storm: "ability_rogue_shurikenstorm",
  spell_priest_power_word: "spell_priest_power-word",
  spell_priest_void_flay: "spell_priest_void-flay",
  spell_priest_void_blast: "spell_priest_void-blast",
  spell_frost_ice_shards: "spell_frost_ice-shards",
  spell_firefrost_orb: "spell_firefrost-orb",
};

function parseIcons(texts) {
  const byEntry = new Map(), bySpell = new Map(), byName = new Map();
  for (const txt of texts) {
    const re = /id:\s*(\d+),\s*name:\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"),\s*icon:\s*'([^']*)',\s*maxRanks:\s*\d+,\s*entryIds:\s*\[([^\]]*)\]/g;
    let m;
    while ((m = re.exec(txt))) {
      const icon = ICON_FIX[m[4]] || m[4], name = (m[2] !== undefined ? m[2] : m[3]).replace(/\\(.)/g, "$1");
      for (const e of m[5].split(",").map(Number).filter(Boolean)) byEntry.set(e, icon);
      if (!bySpell.has(+m[1])) bySpell.set(+m[1], icon);
      if (!byName.has(name)) byName.set(name, icon);
    }
  }
  return t => byEntry.get(t.entry) || bySpell.get(t.spell) || byName.get(t.name) || "";
}

// -------------------------------------------------------------------- build
// Where each node sits and what it leads to, by node id: { x, y, next, f }.
// x and y are the game's own coordinates in units of 300, half a column; f is
// 1 when the first talent on the node is an active ability, 2 the second, 4 a
// choice node.
function layoutFromRaidbots(txt) {
  const L = {};
  for (const s of JSON.parse(txt)) for (const n of [...s.classNodes, ...s.specNodes]) {
    const es = (n.entries || []).filter(e => e.spellId).sort((a, b) => a.index - b.index);
    if (!es.length) continue;
    const c = L[n.id] || (L[n.id] = { x: Math.floor(n.posX / 300), y: Math.floor(n.posY / 300), next: new Set(), f: 0 });
    for (const v of n.next || []) c.next.add(v);
    es.slice(0, 2).forEach((e, i) => { if (e.type === "active") c.f |= 1 << i; });
    if (n.type === "choice") c.f |= 4;
  }
  for (const c of Object.values(L)) c.next = [...c.next];
  return L;
}
function layoutFromFile() {
  const L = {};
  try {
    const w = {}; new Function("window", fs.readFileSync(FILE, "utf8"))(w);
    for (const c of Object.values(w.TALENTS.classes)) for (const [id, n] of Object.entries(c.nodes))
      if (n.length >= 6) L[id] = { x: n[1], y: n[2], next: n[4], f: n[5] };
  } catch (e) { /* no file yet */ }
  return L;
}

function build(traitTxt, iconTexts, refs, layout) {
  const { build: wowBuild, traits } = parseTraits(traitTxt);
  const iconOf = parseIcons(iconTexts);
  const classes = {}, specs = {}; const noIcon = [], noPlace = new Set();
  for (const t of traits) {
    if (!t.cls || !t.node) continue;
    const c = classes[t.cls] || (classes[t.cls] = { order: new Set(), nodes: {} });
    c.order.add(t.node);
    if (t.tree === 2) for (const s of t.specs) specs[s] = t.cls;
    const reach = t.tree === 1 ? t.req < CLASS_POINTS : t.tree === 2 ? t.req < SPEC_POINTS : false;
    if (!reach || t.row < 1 || t.col < 1 || !t.spell) continue;   // spell 0: a placeholder the game does not show
    const at = layout[t.node];
    if (!at) { noPlace.add(`${t.name} (node ${t.node})`); continue; }
    const n = c.nodes[t.node] || (c.nodes[t.node] = { t: t.tree, at, e: [] });
    const icon = iconOf(t);
    if (!icon) noIcon.push(`${t.name} (${t.spell})`);
    n.e.push({ sel: t.sel, v: [t.spell, t.max, t.name, icon, t.specs] });
  }
  const out = { build: wowBuild, sources: refs, points: [CLASS_POINTS, SPEC_POINTS], specs, classes: {} };
  for (const [id, c] of Object.entries(classes)) {
    const nodes = {};
    for (const [nid, n] of Object.entries(c.nodes))
      nodes[nid] = [n.t, n.at.x, n.at.y, n.e.sort((a, b) => a.sel - b.sel).map(e => e.v),
                    n.at.next.filter(v => c.nodes[v]).sort((a, b) => a - b), n.at.f];
    out.classes[id] = { order: [...c.order].sort((a, b) => a - b), nodes };
  }
  return { data: out, noIcon, noPlace: [...noPlace] };
}

function write(data) {
  const head = "// Talent trees for the page, written by talentdata.js. Do not edit by hand.\n" +
    `// Game build ${data.build}. Rows a level-30 character cannot reach are left out.\n`;
  fs.writeFileSync(FILE, head + "window.TALENTS = " + JSON.stringify(data) + ";\n");
}

// --------------------------------------------------------------------- read
// A talent string, as the game writes it: 8 bits of version, 16 of spec id, a
// 128-bit tree hash, then for each node of the class in id order: selected;
// if so, purchased; if so, partly ranked (and 6 bits of rank) and choice node
// (and 2 bits of which). Six bits a character, lowest first. The page carries
// the same reader.
const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function read(str, data) {
  const v = [...str].map(ch => B64.indexOf(ch));
  if (!v.length || v.includes(-1)) return null;
  let pos = 0;
  const bits = n => { let x = 0; for (let i = 0; i < n; i++, pos++) { const ch = v[Math.floor(pos / 6)]; if (ch !== undefined && (ch >> (pos % 6)) & 1) x += 2 ** i; } return x; };
  const version = bits(8), spec = bits(16); pos += 128;
  const cls = data.classes[data.specs[spec]];
  if (!cls) return { version, spec, picks: null };
  const picks = {};
  for (const id of cls.order) {
    if (!bits(1)) continue;
    const p = { bought: !!bits(1), rank: 0, choice: 0 };
    if (p.bought) { if (bits(1)) p.rank = bits(6); if (bits(1)) p.choice = bits(2); }
    picks[id] = p;
  }
  return { version, spec, picks, over: pos > v.length * 6 };
}

function pageStrings(file) {
  const html = fs.readFileSync(file, "utf8");
  const out = new Set();
  for (const m of html.matchAll(/talents"?:\s*(\{[^}]*\}|"[^"]*")/g))
    for (const s of m[1].matchAll(/"([A-Za-z0-9+\/]{30,})"/g)) out.add(s[1]);
  return [...out];
}

function check(file) {
  const sandbox = {}; new Function("window", fs.readFileSync(FILE, "utf8"))(sandbox);
  const data = sandbox.TALENTS; let bad = 0;
  const strs = pageStrings(file);
  for (const s of strs) {
    const r = read(s, data), why = [];
    if (!r || !r.picks) why.push("not a talent string of a known spec");
    else {
      const cls = data.classes[data.specs[r.spec]]; let cp = 0, sp = 0;
      if (r.over) why.push("shorter than the class's tree");
      for (const [id, p] of Object.entries(r.picks)) {
        const n = cls.nodes[id];
        if (!n) { if (p.bought) why.push(`node ${id} is not on a row a level-30 character reaches`); continue; }
        const e = n[3].filter(x => !x[4].length || x[4].includes(r.spec))[p.choice];
        if (!e) { why.push(`node ${id} has no talent for spec ${r.spec}`); continue; }
        if (p.bought) { const k = p.rank || e[1]; if (n[0] === 1) cp += k; else sp += k; }
      }
      if (cp !== data.points[0] || sp !== data.points[1]) why.push(`${cp} class and ${sp} spec points, not ${data.points.join(" and ")}`);
    }
    if (why.length) { bad++; console.error(`FAIL ${s}\n     ${why.join("; ")}`); }
  }
  console.log(`${strs.length} talent strings read against game build ${data.build}: ${strs.length - bad} legal level-30 builds, ${bad} not`);
  process.exit(bad ? 1 : 0);
}

// --------------------------------------------------------------------- main
async function main() {
  const args = process.argv.slice(2);
  if (args[0] === "--check") return check(args[1] || path.join(ROOT, "index.html"));
  if (args[0] === "--fetch") {
    const get = async url => { const r = await fetch(url, { headers: { "User-Agent": "fate-bis" } }); if (!r.ok) throw new Error(`${r.status} ${url}`); return r.text(); };
    const head = (repo, ref) => require("child_process").execSync(`git ls-remote https://github.com/${repo}.git "${ref}"`).toString().split(/\s/)[0];
    const simc = head("simulationcraft/simc", args[1] || "midnight"), wa = head("WoWAnalyzer/WoWAnalyzer", "HEAD");
    if (!simc || !wa) throw new Error("could not resolve the source commits");
    process.stderr.write(`fetching trait_data.inc at ${simc.slice(0, 7)} and the icon tables at ${wa.slice(0, 7)}\n`);
    const traitTxt = await get(`https://raw.githubusercontent.com/simulationcraft/simc/${simc}/engine/dbc/generated/trait_data.inc`);
    const icons = [];
    for (const f of WA_FILES) icons.push(await get(`https://raw.githubusercontent.com/WoWAnalyzer/WoWAnalyzer/${wa}/src/common/TALENTS/${f}.ts`));
    const refs = { simc: simc.slice(0, 7), wowanalyzer: wa.slice(0, 7) };
    let layout;
    try { layout = layoutFromRaidbots(await get("https://www.raidbots.com/static/data/live/talents.json")); refs.layout = "raidbots " + new Date().toISOString().slice(0, 10); }
    catch (e) { layout = layoutFromFile(); refs.layout = carried(); process.stderr.write(`Raidbots not reached (${e.message}): places and lines carried over from assets/talents.js\n`); }
    return finish(build(traitTxt, icons, refs, layout));
  }
  if (args.length === 2 || args.length === 3) {
    const icons = WA_FILES.map(f => fs.readFileSync(path.join(args[1], f + ".ts"), "utf8"));
    const refs = { simc: "local", wowanalyzer: "local", layout: args[2] ? "raidbots, local copy" : carried() };
    const layout = args[2] ? layoutFromRaidbots(fs.readFileSync(args[2], "utf8")) : layoutFromFile();
    return finish(build(fs.readFileSync(args[0], "utf8"), icons, refs, layout));
  }
  console.log("usage: node talentdata.js --fetch [ref] | <trait_data.inc> <WoWAnalyzer TALENTS dir> [talents.json] | --check [index.html]");
  process.exit(2);
}
// The layout stamp of the file on disk, for a run that carries its places over.
function carried() {
  try { const w = {}; new Function("window", fs.readFileSync(FILE, "utf8"))(w); return w.TALENTS.sources.layout || "carried"; }
  catch (e) { return "none"; }
}
function finish({ data, noIcon, noPlace }) {
  write(data);
  const n = Object.values(data.classes).reduce((a, c) => a + Object.keys(c.nodes).length, 0);
  console.log(`assets/talents.js: game build ${data.build}, ${Object.keys(data.classes).length} classes, ${Object.keys(data.specs).length} specs, ${n} nodes drawn, ${fs.statSync(FILE).size} bytes`);
  if (noIcon.length) console.log(`no icon on file for ${noIcon.length}: ${noIcon.join(", ")}`);
  if (noPlace.length) console.log(`no place on file for ${noPlace.length}, left out: ${noPlace.join(", ")}`);
}
main().catch(e => { console.error(e.message); process.exit(1); });
