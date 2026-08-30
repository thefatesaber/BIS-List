# Legacy Thirty BiS compendium — project record

Sim-validated Best-in-Slot for all 13 classes at level 30 (12.1.0 / Midnight),
hosted at thefatesaber.github.io/BIS-List/. One self-contained `index.html`
with the dataset embedded as JS literals; `list/` holds the benchmark `.simc`
profiles that produced every number on the page. Three constraint tiers per
spec — All-time, Obtainable, Herald of the Titans (ilvl ≤ 41, Classic/TBC/
WotLK sources, necks/rings/trinkets exempt) — and DPS must satisfy
Herald ≤ Obtainable ≤ All-time. `list/Dummy mode/` holds reconciliation
copies, which follow looser rules than benchmarks (see hunters_mark below).

SimC branch: midnight (d0d2db1). DBC references come from
`raw.githubusercontent.com/simulationcraft/simc/midnight/engine/dbc/generated/`.

## Standing rulings

**Self-buffed rail: own kit in, other actors out.** Benchmark profiles
carry no external buffs — no `external_buffs.pool` of any kind and no
`invoke_external_buff` of any kind. Abilities the actor legitimately has at
30 are in, which sanctions the priest's PI self-cast and rules out PI
appearing anywhere else.

**Power Infusion is priest kit.** PI (spell 10060) is the priest class
tree's row-3 talent and the benchmark build takes it, so the benchmark
priest self-casts it. Spell data still carries a vestigial Spell Level 58;
the sanctioned workaround is `override.spell_data=spell.10060.spell_level=1`
before the actor, priest profiles only. An earlier ruling that the spell
was removed from client data and segfaulted was true of the d0d2db1 data
snapshot and is superseded on a9a6985 — verify build-specific data claims
with `spell_query` before acting on them.

**Health timeline is standby only.** `#enemy_custom_health_timeline=20:0.2`
stays commented in every benchmark profile. All page DPS is simmed without
it. Never enable it unprompted; a health-timeline standard is an open ruling.

**target_level is relative.** `target_level=+3` parses as absolute level 3
(the level-3-boss bug that inflated an entire prior rail archive). The only
correct form is `target_level+=3`.

**hunters_mark: the override is the cast.** Hunter's Mark is known at 30
(verified in-game 2026-08-30): spell 257284, 3% damage taken, no
conditions, single target, permanent. simc 1210-01 carries no
hunters_mark action, so `override.hunters_mark=1` is the sanctioned
stand-in for the hunter's own precombat cast on hunter benchmark
profiles — exact on patchwerk, and the value matches live (the 2.9%
measured removal delta against the 3% tooltip). On non-hunter profiles
it assumes an actor the rail excludes and stays banned. If the engine
gains the action, or the spell regains conditional rules, the cast
replaces the override and this ruling is re-derived.

**Synthetics are lowercase and end in `_proxy`.** A synthetic item or buff
sharing a name with a real DBC entry is dropped silently, with no error.
Every hand-built proc token is lowercase with a `_proxy` suffix, and the
post-sim check is that every `*_proxy` appears in the proc details.

**Head is the proxy slot.** `enchant=<stat>` tokens (e.g. `12crit`, `1sp`)
are deliberate set-bonus proxies for bonuses SimC/Raidbots cannot compute at
level 30. They live on the head line because head has no real enchant, they
are never deleted, and they never share a line with a real `enchant_id` —
the later param overrides the earlier one (the warlock wrist `1sp` case).
Real enchants use `enchant_id` only, everywhere.

**Proc calibrations are per-spec.** `procby/attack` flat percentages fire
per attack event, so the same effective ppm encodes as a different % on each
spec's event density. Untamed Blade at Fury 4% and Ret 14% are the same
proc; never harmonize flat rates across specs. Calibration workflow: anchor
procs/min from logs, validate against sim proc-detail procs/min at a single
run, rescale linearly. Of record: Dragonspine 2.7% (warrior All-time 3.5%
pending ruling A), Untamed warrior 4 / paladin 14, Bonereaver DK 11
(warrior 4 pending ruling A), Jackhammer warrior 2%, Eskhandar monk 2.5 ppm
(rogue carries a 1.2 vs 0.9 spread — open), Crusader ring encoding warrior
1.3% / paladin 5.3%. `ppm` fires per qualifying attack, `rppm` is
time-based with bad-luck protection; chance-on-hit weapons usually want
flat % per attack.

**Items are explicit.** Every `id=` line carries `ilevel=` pinned to the
page — `drop_level=30` alone is insufficient on scaling gear. Item strings
for synthetics are fully explicit (weapon type/speed/damage, stats, equip
proc); bare `id=` lookups fail to attach proc effects. Item names derive
from the DBC id, never from profile comments. One item id carries one ilvl.

**Consumables are closed off.** `temporary_enchant=disabled` (not `none`,
never blank — a blank field triggers the fallback) and
`augmentation=disabled` in every per-actor block (blank falls back to an
augment rune).

**Known engine traps.** Brutal Earthstorm Diamond (25899) in any non-weapon
slot segfaults via a nullptr in `enchants.cpp:168` — Feral uses Relentless
Earthstorm (32409). Shaman meta is Mystical Skyfire (25893); any 76885 in
an export is replaced. `howling_rune` needs a rank suffix. `use_off_gcd=1`
for precise on-use cadence; `default_item_group_cooldown=0` prevents the
shared 20s item-group starvation. Sim-wide overrides precede the actor
declaration. Hero-tree talent references compile to 0 at level 30 — routing
gated on them must be collapsed, not just deleted. `override.spell_data`
cannot fix values hardcoded in module C++ (Lava Surge rate, Resto LvB crit
scaling) — `line_cd` tuning is the workaround.

**Standing item decisions.** Distant Land is the 3-socket 50695, never the
2-socket 50040. Crusader on paladin/warrior weapons. Major Spellpower on DH
weapons via `enchant_id=2669`. Heroic Solace (47432) as shaman trinket 1.
Vibroblade's armor debuff cannot be modeled natively: encode as
`stats=Xvers`, X = 118 × uptime (raid-averaged for benchmarks, dummy uptime
for calibration copies).

**Survival.** Mongoose Fury applies unconditionally in
`raptor_strike_base_t::execute()` with no talent gate; every Survival
profile carries `override.spell_data=effect.483865.base_value=0` above the
actor. Hunter's page spec is Marksmanship across all three lists, final;
`best_spec_for_each_class.txt` is retired and non-authoritative. Survival
returns to the page only through the gate: a clean SV rebuild simmed against
a same-character MM comparator.

## Open rulings

- **A** — do per-spec flat rates extend to Dragonspine and Bonereaver? If
  yes, warrior All-time Dragonspine reverts to 3.5 before the warrior sim
  and warrior Bonereaver 4 vs DK 11 stands as-is.
- **B** — does a rebase notice go public on the page, or does the rebase
  land silently? Gates the provenance rendering.
- Health-timeline standard (which curve, if any, ever becomes benchmark).
- Rogue Eskhandar 1.2 (All-time) vs 0.9 (Obtainable/Herald) — one spec,
  one calibration; which is anchored.
- Monk Herald anomaly; DH Herald trinket; DK Roccor-vs-Chaos alt sweep.

## Data shape

Rows: `slot, item, wowhead, ilvl, source, status`, optional `q, ench,
enchsp, gems, hm ("only"|"socket"), alts [{item, wowhead, q, delta}], why`.
New optional fields: `altbase` — the base sim DPS an alt sweep's deltas
were computed against (stamped when the sweep runs, so deltas stay
interpretable after a rebase); `prov` — a provenance stamp (sim date and
build) whose rendering is gated on ruling B.

## Wave workflow

Fix set is cut per list directory and linted to zero. Sims run at 50k
iterations (`calculate_scale_factors=0` halves runtime when weights aren't
needed). Three checks on every report before a number is accepted: every
`*_proxy` fires near its calibration in the proc details, `power_infusion`
is absent from the buff tables, and no augment rune appears. Files are then
renamed to the new DPS prefix (the prefix drives rail ordering — use
Vibroblade-inclusive numbers as-is), the list directory is replaced
wholesale, and the page rebases DPS, stats, and talents from the reports,
gated on `validate.js` monotonicity against the untouched lists.

## Tooling

- `node validate.js index.html` — page dataset gate (blocking in CI).
- `node lint_profiles.js [--advisory] [--page index.html] <dir>...` —
  profiles vs page and rulings; advisory in CI until every list dir lints
  0/0, then the flag is deleted and drift can't merge.
- `node diffdata.js old.html new.html` — dataset delta between two builds;
  run on HEAD~1 vs HEAD before pushing a rebase.
- `talent_sim_gen.cpp` — level-30 legal-build enumerator for profileset
  sweeps (`--tree both`, `--list`, `--exclude-file`).
- Planned: `gen_profiles.js`, page-to-profile generation, druid pilot
  first.

Commit messages are prose paragraphs — what changed and why, with
flagged-but-not-applied items listed separately.
