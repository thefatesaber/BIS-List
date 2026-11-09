#!/usr/bin/env python3
# Build BracketSim batch files: one single-actor .simc per (entry, leg), each
# carrying BracketSim's option block so no box needs ticking.
import re, sys, os, json, subprocess
ROOT = __import__("os").path.dirname(__import__("os").path.dirname(__import__("os").path.dirname(__import__("os").path.abspath(__file__))))
FIRE = {"shaman","shaman_elemental","mage_fire","warlock","warlock_demonology","warlock_destruction","evoker"}
INT = {"mage","shaman","priest","warlock","evoker","demonhunter"}
# Primary-stat buff by spec where it differs from the class (the page's PRIMARY map)
INT_SPEC = {"druid_balance": True, "demonhunter_havoc": False, "shaman_enhancement": False}
OWN = {"mage":"Arcane Intellect","warrior":"Battle Shout","shaman":"Skyfury","druid":"Mark of the Wild"}
RAID = ["Arcane Intellect","Battle Shout","Blessing of the Bronze","Mark of the Wild","Power Word: Fortitude","Skyfury","Drums of Fury","Chaos Brand","Mystic Touch","Hunter's Mark","Bleeding","Power Infusion"]
WORLD = ["Fengus' Ferocity","Slip'kik's Savvy","Flame Cap","Icecrown Citadel buff","Plague Stream (Plague Scientist)","Adventurer's Journal"]
SET = {"Arcane Intellect","Battle Shout","Mark of the Wild","Skyfury","Drums of Fury","Hunter's Mark"}

def actor(path, name):
    s = open(path, encoding="utf-8").read()
    body = [l for l in s.split("\n") if not l.startswith("#") and l.strip()]
    out = []
    for l in body:
        m = re.match(r'^(\w+)="[^"]*"$', l)
        out.append(f'{m.group(1)}="{name}"' if m else l)
    return out

def cons_of(lines):
    g = lambda k: next((l.split("=",1)[1] for l in lines if l.startswith(k+"=")), "disabled")
    te = g("temporary_enchant"); w = "none"
    if te != "disabled":
        parts = dict(x.split(":") for x in te.split("/")); w = parts.get("main_hand") or parts.get("off_hand") or "none"
    return {"Flask": g("flask"), "Elixir": "none", "Food": g("food"), "Potion": g("potion"), "Augment Rune": "none", "Weapon": w}

def block(raid_on, world_on, cons):
    box = lambda b, on: f"#   [{'x' if b in on else ' '}] {b}"
    L = ["# BracketSim simulation options - pasted back into BracketSim, these lines set the same boxes", "#", "# World buffs:"]
    L += [box(b, world_on) for b in WORLD] + ["#", "# Raid buffs:"] + [box(b, raid_on) for b in RAID]
    L += ["#", "# Misc options:", "#   [x] Detailed SimC Report", "#   [ ] Vary fight length by up to 20% each iteration", "#   [ ] Add an Augmentation Evoker to the group", "#   [ ] Also calculate stat weights", "#", "# Teammate armor reduction: none", "#", "# Consumables:"]
    L += [f"#   {k}: {v}" for k, v in cons.items()]
    return "\n".join(L) + "\n"

def has_flame_cap(path):
    return "[x] Flame Cap" in open(path, encoding="utf-8").read()

def primary_of(cid, cls):
    isint = INT_SPEC.get(cid, cls in INT)
    return "Arcane Intellect" if isint else "Battle Shout"

def legs_for(cid, cls, path=None):
    primary = primary_of(cid, cls)
    legs = ["baseline"]
    for b in ["Skyfury", "Mark of the Wild", primary, "Drums of Fury"]:
        if OWN.get(cls) != b: legs.append("no " + b)
    if cid in FIRE: legs.append("no Flame Cap")   # every fire caster, ruling 2026-11-07
    legs += ["no Potion", "no Flask", "no Food", "no Weapon Buff", "no Consumables"]
    return legs

def make(path, name, cid, cls, leg, outdir, title):
    lines = actor(path, name)
    raid_on = set(SET); world_on = {"Flame Cap"} if cid in FIRE else set()
    if leg.startswith("no ") and leg[3:] in raid_on: raid_on.discard(leg[3:])
    if leg == "no Flame Cap": world_on.discard("Flame Cap")
    off = {"no Potion": ["potion"], "no Flask": ["flask"], "no Food": ["food"], "no Weapon Buff": ["temporary_enchant"], "no Consumables": ["potion","flask","food","temporary_enchant"]}.get(leg, [])
    lines = [(k + "=disabled" if any(l.startswith(k + "=") for k in off) else l) for l in lines for k in [l.split("=",1)[0]]]
    cons = cons_of(lines)
    head = [f"# Legacy Thirty BiS — Buff worth — {title} — {leg}", "# One actor, BracketSim's option block below sets the boxes; Hunter's Mark is computed, not simmed.",
            "# Anything set here wins over the options below: the fight and the precision of the lists.",
            "iterations=20000", "target_error=0", "max_time=300", "fixed_time=1", "vary_combat_length=0", "fight_style=Patchwerk", ""]
    txt = "\n".join(head + lines) + "\n\n" + block(raid_on, world_on, cons)
    fn = f"{title} - {leg}.simc"
    open(os.path.join(outdir, fn), "w", encoding="utf-8").write(txt)
    return fn

if __name__ == "__main__":
    outdir = sys.argv[1]; os.makedirs(outdir, exist_ok=True)
    specs = json.loads(sys.argv[2])   # [[profile path, actor name, cid, cls, title, legs or null], ...]
    n = 0
    for path, name, cid, cls, title, legs in specs:
        for leg in (legs or legs_for(cid, cls, os.path.join(ROOT, path))):
            make(os.path.join(ROOT, path), name, cid, cls, leg, outdir, title); n += 1
    print(n, "files in", outdir)
