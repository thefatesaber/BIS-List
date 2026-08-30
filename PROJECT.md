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

**Proc calibrations: log anchors, per-spec encodings.** Every calibrated
proc has a live anchor in procs/min, measured from WCL buff tables
(applications ÷ fight minutes). The engine encodings are then solved by
running the profile, reading sim procs/min from the buff table, and
rescaling linearly — twice, because haste procs feed the attack-event
stream and the first pass lands ~5–12% under anchor in the corrected
environment. Anchors of record: Dragonspine warrior 2.47/min + DK
1.8/min (the two independently solve to the same per-event chance, so
the trinket is universal: 103 haste payload per tooltip, 3.2% on every
spec); Untamed warrior 12.4/min; Jackhammer warrior 4.5/min; Bonereaver
warrior 27.6/min + DK 11.0/min; Eskhandar 2.47/min; Crusader ring
encoding warrior 20.4/min combined; Destiny 13/min. Frozen encodings:
DST 3.2 everywhere, Untamed warrior 3.7 / paladin 19.6, Jackhammer 1.3,
Bonereaver warrior 9.8 / DK 8.6, Eskhandar monk 0.88 / rogue 0.4 ppm,
Crusader warrior 3.0 per ring / paladin 16.2. The paladin values are
warrior-derived (same 2H swing rate); one paladin log hardens or
corrects them. Weapon chance-on-hit rates stay per-spec — sim
"attack events" are all damaging impacts, so identical per-swing items
need different per-impact encodings per rotation. The `ppm` token also
fires per event, not per minute; only the buff table's realized
procs/min is truth. Local verification runs on the container build
(midnight HEAD) reproduce every wave DPS within noise, so engine parity
holds and sim-side rates from either build are interchangeable.

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

- Health-timeline standard (which curve, if any, ever becomes benchmark).
- Paladin Untamed 19.6 / Crusader 16.2 are warrior-derived inferences —
  a single paladin log (buff applications ÷ minutes) hardens them.
- Monk Herald anomaly; DH Herald trinket; DK Roccor-vs-Chaos alt sweep.

Closed: A (per-spec confirmed; Dragonspine resolved universal by two-log
convergence — 3.5 and 2.7 both retired for 3.2), B (public), the rogue
Eskhandar spread (both tiers rescale to the one 2.47/min item anchor).

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
