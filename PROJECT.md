# Legacy Thirty BiS compendium — project record

Sim-validated Best-in-Slot for all 13 classes at level 30 (12.1.0 / Midnight),
hosted at thefatesaber.github.io/BIS-List/. One self-contained `index.html`
with the dataset embedded as JS literals; `list/` holds the benchmark `.simc`
profiles that produced every number on the page. Four constraint tiers per
spec — All-time, All-time Full buffed, Obtainable, Herald of the Titans
(ilvl ≤ 41, Classic/TBC/WotLK sources, necks/rings/trinkets exempt) — and
DPS must satisfy Herald ≤ Obtainable ≤ All-time ≤ All-time Full buffed.
All-time Full buffed is mid-rollout: specs appear as their buffed profiles land (Restoration Shaman first, 5787). `list/Dummy mode/` holds reconciliation
copies, which follow looser rules than benchmarks (see hunters_mark below).

SimC branch: midnight (d0d2db1). DBC references come from
`raw.githubusercontent.com/simulationcraft/simc/midnight/engine/dbc/generated/`.

## Standing rulings

**Self-buffed rail: own kit in, other actors out.** All-time Full buffed
is this rail's one sanctioned exception — raid buffs are the point of that
list. Its buff set, as fixed by the landed profiles (Resto Shaman 5787,
Devourer DH 4725, and the specs that followed): Bloodlust, Mark of the
Wild, Hunter's Mark and Skyfury ON for everyone; Arcane Intellect ON for
casters and Battle Shout ON for physical specs, each spec taking the
primary-stat buff that feeds it (first physical profile: MM Hunter 4337); an external
Power Infusion pool (external_buffs.pool=power_infusion:120) plus its
invoke line on EVERY buffed profile, per Fate's 2026-09-30 ruling — PI is
part of the buffed set, full stop; the priest self-casts instead of
pooling, and the spell.10060.spell_level=1 unlock accompanies the pool
everywhere (PI is level-gated at 30 without it, proven by the Devourer
re-sim). Buffed profiles landed before this ruling without a pool are
under-set and sit on the buffed re-sim queue. Considered and declined the
same day: hiding the buffed tab while re-sims catch up — the tab stays
public, its numbers dated by prov; Power Word: Fortitude, Battle Shout, Mystic Touch,
Chaos Brand and bleeding OFF; consumables run live in-sim where
benchmarks disable them. Bloodlust is level-enabled via the standard
player-scoped override (spell.2825 spell_level=1) and modeled at DRUMS
strength - effect.856.base_value=15 gives 15% haste instead of the 30%
lust. Resolved 2026-09-30: Resto Shaman re-ran on this set (5944, PI pool +
Skyfury), retiring the flagged 5787. 2026-10-01: Frost DK followed (4090 ->
4855, rebuilt per the Server58 ruling) - no buffed profile predates Skyfury. Later the same day the PI wave itself closed: Feral, Survival, Outlaw, Arms, Unholy and Havoc re-ran on the template, so every buffed profile now invokes PI; Enhancement joined the same evening at 3415, completing the rail: 27 specs, all buffed profiles on the complete set. The rail then got its ledger: the Buff worth panel (buffWorth arrays in index.html, rendered on the buffed list only) prices Consumables, Power Infusion, drums-lust and Hunter's Mark per spec from minus-one-line A/B re-runs; statuses are measured or derived - the last five PI estimates became exact A/Bs on 2026-10-03 - Outlaw's rows are effective-scale, the priest's PI is its own cast. The claimed PI dead zone fell entirely on 2026-10-03 to Fate's fresh clean pairs - Arcane +99, Elemental +87, Balance +117; each old near-zero had compared the record against a held run that still carried the invoke. The queued seven re-ran the same day: Sub, Ret and Fury confirmed exactly; WW corrected 432 -> 113 (the board's largest artifact), Feral 175 -> 165, Havoc 115 -> 114, Demo 71 -> 106. All 27 PI cells now rest on Fate's own minus-one-line A/Bs - PI is worth 2.6-6.5% everywhere - and Monk passed Paladin on the PI-less rail, the only order change of the whole correction arc. Ruling 2026-10-03: the buffed list DISPLAYS PI-less DPS - dpsFor subtracts each spec's measured PI worth at render (bestOf and the rail sort follow it); the data layer keeps the sim numbers of record, and the priest's own-cast PI stays in its displayed number. The stat trio was priced 2026-10-05 in 12 runs (4 buff-legs x 3 calibration-isolated groups, all 27 specs as co-actors under single_actor_batch; profilesets cannot vary sim-scoped overrides, proven that evening): Skyfury 5-14% on melee via windfury and 1-2% mastery on casters (Resto a true 0), Mark of the Wild 2.4-2.9% everywhere, Battle Shout 4.7-4.8% / Arcane Intellect 2.6-2.9% with warriors and mages at 0 - own-cast like priest PI, the fourth and fifth members of that family. All 81 cells landed measured; the Base legs re-verified the whole stored buffed column within 2 DPS. Hunter's Mark followed the same evening - one MinusHM leg per group replaced the last 26 derived cells with measurements: every spec lands 2.86-2.94%, the exact signature of a flat x1.03 debuff read from the buffed side (1 - 1/1.03 = 2.91%); monk's lone pre-measured cell reproduced at 128, the priest corrected +6 off its stale base, hunters' cells carry the own-cast note, and no derived row remains anywhere in the panel. The panel's last five zero cells (warrior BS, mage AI - own casts) were priced 2026-10-07 by strip-the-cast legs (self-cast removed from the APL, override zeroed): own BS 4.7% for both warriors, matching the external band exactly - the override is faithful; own AI 4.4/4.3/5.9% for Frost/Fire/Arcane - a mage's own Intellect outprices AI on every other caster, int's budget share plus Arcane's Savant mana double-dip. Every cell in the panel now carries a measured value. Display ruling 2026-10-07 evening: the panel went collapsible (option C of three mocks) - component rows fold under the Consumables chevron, collapsed by default, same grid, renderer-only. Adds-up ruling, same evening: the Consumables parent is DEFINED as the exact sum of its component rows (tag TOTAL, pct on the children's denominator); the old joint-removal aggregates retired - they mixed eras (priest's was 5573-era, Devour's pre-drift) where the sums are same-run and current; the stone initially sat outside the total, then joined it the same evening - a visible child sums like one, and the melee understatement is finally in the headline cell (Fury 612, Assa 894, WW 817); the stone's note reads "baked into weapon stats". The pct column aligned the same way minutes later: the TOTAL row's pct is the sum of the children's displayed pcts, so both columns add exactly on all 27 panels - sweep-verified. Titles ruling, same evening (combo A): Buff worth in class-colored Cinzel with a fading hairline (--cc scoped onto the panel), siblings in dusty Cinzel. The Consumables cells began itemizing 2026-10-07: a Fury profileset pilot proved profilesets DO vary actor-scoped options (consumable lines, gear) - potion 63 / flask 148 / food 60 compose to 271 against the 269 aggregate, and the weapon stone priced at 341 (6.1%), outside the aggregate, quantifying the melee understatement; 26 spec files are out, casters splitting off their oils, melee their stones. 19 of 27 panels itemized by evening: 58 rows landed across 15 specs, every aggregate reconfirmed within 13 DPS by its components - stones are the largest single consumable wherever they exist (daggers 12.9%, fists/2H 5.6-10.5%), flasks the biggest bottle, Pandaren Epicurean visible in WW's doubled food. The drift confirmed on A/A re-runs of the untouched stored inputs (3724/3652/3903, agreeing with the split bases within 2): all three buffed numbers moved as engine corrections, profiles renamed content-unchanged, components landed - 22 of 27 panels itemized. Their pre-split cells stay priced on the old engine, re-pricing parked. The caster wave closed the same evening - 26 of 27 itemized, five caster bases exact, oils a tight 4.4-4.7%, Pandaren Epicurean across all three Pandaren toons, Resto's components summing 945 vs its 946 aggregate. Devour answered the same evening: A/A 5659 (split Base 5657, within 2) - the second intraday Devourer engine event, +7.8%, the server58 jump exactly. Buffed moved to 5659 and its components landed (dual oil 499, 8.8%, double the single-oil band) - 27 of 27 itemized, the campaign closed. The three lists answered the same evening: 3838/3689/2918, each exactly stored x 1.0779 - the drift is one uniform multiplier across the whole column, now current on the evening engine, and the panel re-priced the same night on the 5656 build - 7 runs, Base exact, HM printing the x1.03 signature to the digit (165), PI 302 -> 279 on the reworked meta window. No old-engine cells remain on Devour; Enh/Unholy/SV re-pricing stays parked. Shadow followed Devour's consistency play 2026-10-07: the buffed 5757 regems at an unchanged number (neck's third socket Lava Coral -> second Masterful Emerald, finger2 takes the Lava Coral back - gem totals and the sheet identical), and its 11-row panel heads into a full Devour-pattern re-evaluation on the new build. The panel answered 2026-10-08: 7 runs, Base 5754 (-3 on the stored number, run noise - the stored 5757 stands), Consumables 948 from components within 2 of the campaign cells, HM 165 printing the signature (2.87%), and the 5573-era cooldown pair finally current - own-cast PI 308 -> 329, Drums 184 -> 159. Every priest cell is measured on the regemmed build; no stale-era cells remain on Shadow. The site took its first full outside-in audit 2026-10-10 (project doc) - 16 sections from class-legality to WCAG - and the first finding fell the same day: Herald Ret's Warrior-only shoulders regeared to the paladin token at an unchanged 2768, stats moving one rating point. Unholy followed within the hour - both Warrior pieces out for Sunwell trash (34601/34615), 2221 -> 2237 - after the catch: the first DK uploads re-labeled the shoulder but still simmed Destroyer's id, so 2250/2838 were held and corrected single-token inputs issued; Frost's clean re-run landed the same hour at 2825 (+2) - the audit's section 1 stood 3 of 9 fixed within the hour, 4 of 9 by late morning - Arcane swapped the unswingable Torch for The Turning Tide (1966 -> 1967), Fire followed at 2895, paying 12 for the same legality; Frost mage closed the mage Torches at 3184 - 6 of 9, the Warlocks to come (the Torch stays legally on the five mace-caster lists). Demonology opened the lock wave at 2262, paying 17 for the double legalization - 7 of 9 - and Destruction mirrored it at 2509 (-18). Affliction closed the section at 2848 (-22) before noon: all nine audit-flagged lists legalized in a single morning of single- and double-token re-runs, every swap DBC-verified, the two half-edited DK uploads the only holds. Section 2 opened before noon: the three hunters returned the first phantom gems (BM -22, MM -33 with a section-9 stamp shed, SV -14). Enhancement followed and took the whole rail with it: its gem-less Herald rode the family drift to 2216 raw / 2351 effective (P_phys kept at the carried 0.514 by ruling, the measured 0.490 parked), inverted the pre-drift rail, and the validator's monotonic gate held the landing until the stored Obtainable and All-time re-ran verbatim - 2516 (+8.9%) and 2618 (+5.8%) - so all three landed in one green commit, the All-time sheet fixing the audit's mastery-rating typo on the way. The same hour Fate closed eight more audit rows by ruling: Eversong Cuffs' second gem is a wrist socket proc, legal as simmed. Devastation closed the audit's multi-gem-neck note the honest way - a mispaired upload briefly read as an exact A/A (patch 314), then the real file landed the neck at 1 gem, 2868 -> 2815, the -53 all gems, the evoker drift question left open. Sub then settled the cloak convention: cloaks do not proc sockets (zero gems - a 1-gem intermediate was held and retired), landing bare at 1226 and confirming the morning strips; the ruling binds the six 2-gem Coming Nights still out. The Frost landing also proved the lint id-check earns its keep: the first cut flipped another entry's row and the gate threw the exact mismatch pre-delivery. The Obtainable wave closed 2026-10-03: all 14 sub-specs landed in one day from candidates built under the rules the 13 main lists established - farmable-in-Midnight items only (Anniversary BRD and the swapped jewelry are the bans) and native sockets only on neck and rings. Every spec now carries All-time, Full buffed and Obtainable. The Herald wave closed the same day: all 14 sub-specs landed under the Herald rules (ilvl <= 41 every slot, Classic/TBC/WotLK armor and weapons, jewelry era-exempt, 50k iterations), completing the grid - every spec carries all four lists. The completed grid then survived its first full logical audit (2026-10-03): chains, off-hands, era/ilvl legality, obtainable bans, duplicates, jewelry sockets, profile-vs-page gear and talents all clean page-wide, and the five findings all resolved - WW Herald's effective conversion moved to its own measured physical share (2762 -> 2757, P 0.969 -> 0.973), the three Outlaw numbers decoded as already-effective from Fate's re-runs (2218/2121/1932.9 raws reconstruct 2473/2365/2155 exactly; stale comment blocks rewritten, no number moved), SV Herald's stored profile came current at 50k (2309 reconfirmed), and the DH Devour Herald trinket race paid out +160 (ToEP -> PotVE solo, 2547 -> 2707). Every other
benchmark profile carries no external buffs — no `external_buffs.pool` of any kind and no
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
from the DBC id, never from profile comments. One item id carries one ilvl
— the documented exceptions live in validate.js's ILVL_SPLIT_OK, and each
needs a reason of record: the Devourer rings (178824, 134487) sim at 47 on
the buffed tier because those are their Timewalking versions (confirmed via
Server58, 2026-09-26). A pin above an item's base ilvl is only legal if
that version actually exists in-game: raid items need the raid-difficulty
Item Versions (Wowhead's Versions column), and a crafted piece with no
higher version cannot be pinned up at all — relic-only wrists cap at 28
(Server58's review, 2026-09-24). Check versions before pinning, not after.

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
- Balance's inert PI invoke: RESOLVED 2026-09-30. The pool alone did not
  move the number - dreamgrove's buff.ca_inc.up gate assumes CA/Incarnation,
  which the 30-point build lacks, so the invoke never fired (proven by a
  bit-identical re-run). The gate of record is now buff.ca_inc.up |
  variable.no_cd_talent & buff.eclipse.up, and PI fires inside Eclipse.
  MM's mana oil came off the same day. Frost DK re-talented and rebuilt
  2026-10-01 (4855: new string, TW-47 rings, Skyfury + PI) - wave bullet closed.
- Outlaw page numbers are effective DPS per Fate's 2026-10-01 ruling
  (buffed 4190 = raw 3758 x 1.1149, Vibroblade armor-shred at
  U=0.5694). Open half: whether All-time's 2473 is raw or already
  effective - Fate to confirm; if raw, it moves to 2757 so the whole
  spec speaks one convention.
- Demonology's of-record APL gates its racials call and potion line on
  pet.demonic_tyrant.active, dead at 30 (the build cannot reach Tyrant,
  proven 2026-09-30 by the buffed PI runs) - they only fire at fight's
  end. Adding |!talent.summon_demonic_tyrant would fix both but moves
  the All-time 2751 benchmark, so it needs its own ruling and re-runs.
- Paladin Untamed 19.6 / Crusader 16.2 are warrior-derived inferences —
  a single paladin log (buff applications ÷ minutes) hardens them.
- DK Roccor-vs-Chaos alt sweep (Monk Herald and DH Herald trinket closed by the 2026-10-03 audit).
- Own-cast raid-buff gaps: CLOSED 2026-10-05, six for six in one evening. The template sweep
  found six benchmark lists missing their class's own raid buff (the doctrine that sanctions
  priest PI and Enh Skyfury); all re-ran on one-line flips: SV Herald 2309 -> 2379 (HM), Feral
  Herald 2321 -> 2389 and Obtainable 2566 -> 2640 (MotW), Elemental Herald 1891 -> 1926,
  Obtainable 2261 -> 2301 and All-time 2355 -> 2397 (Skyfury). Every gain sat on its buff's
  textbook value. Hygiene, no number impact: Fire x3 carry an inert priest-only PI relax; priest buffed keeps two
  inert invoke lines; Aug lacks single_actor_batch (one actor, no-op); both mage sub families name
  the enemy Fluffy_Pillow vs _Custom (identical default actor).
- Skyfury ruling 2026-10-05, made and reversed same day (patches 268/269): the DK buffed list
  briefly retired Skyfury after the community report, then reverted - the Full buffed template
  keeps Skyfury ON for everyone (line-22 definition) and a one-spec retirement left the rail
  mixed. Banked from the detour: Frost DK Skyfury = 331 and PI-on-bare = 141 (server58's pairs,
  the stat trio's first cell). The Elemental question this left open closed with the own-cast
  sweep (patches 270-275): the sanction won - Elemental's three benchmarks joined Enhancement
  on own-cast Skyfury.
- server58 report #2 (2026-10-06, three items). (1) Devourer engine: RESOLVED 2026-10-07.
  Raidbots models the spec natively now, and all four Devour numbers re-verified on that engine
  within noise (3562/3423/2707/5250 vs 3561/3422/2707/5248 stored, Herald exact); his 4985 ->
  5371 jump was a personal stale baseline, not our column. One change landed: the buffed profile
  adopts the metamorphosis-synced potion line (potion,if=buff.metamorphosis.up|fight_remains<=30)
  - the input of record changed, so 5248 -> 5250 rides with it; all seven Devour buff-worth pcts
  hold at one decimal and the Oct-5 legs already ran post-implementation. (2) OPEN - melee stone
  bake: the +15 min/max is confirmed on the buffed rail only (benchmarks clean); the crit half IS in the
  repo after all - stat-syntax helm lines (enchant=3crit 2H / 6crit DW) on the buffed melee heads,
  missed by the 00278 enchant_id-only grep; benchmark heads carry separate legal arcana
  (12/13/15crit), and Enhancement's buffed head (bare 12crit on DW fists) is the one candidate
  gap, queued with this ruling; anomalies for server58: Heartpierce +12/+15, Ret's
  Untamed 31/43 vs Arms/Fury 32/44. Ruling pending: fold stone worth into the melee Consumables
  cells via MinusStone legs (weapon stats are actor-scoped; 3 runs on the group architecture),
  and whether the missing crit joins the bake. In motion 2026-10-07: the consumables-split campaign prices each melee stone directly via per-spec MinusStone profilesets (Fury pilot: 341); the aggregate-cell scope and the crit-bake questions remain for the ruling. (3) OPEN - Feral Mighty Agility -> Superior Impact
  swap: 7 page rows carry enchant 4227 (SV too - scope question for server58); feral's buffed
  staff bakes stone+SI (39/47 vs SV's 37/45 on the same staff) over enchant 1896; the swap means
  3 feral benchmark re-runs plus a buffed rebuild once the SI details are confirmed.
- Jackhammer recalibration (2026-10-07): Fate's All-time Fury re-run prices the 281-haste proc
  at 2.5% per attack (was 1.3%) and swaps the ring Accords Mastery -> Critical Strike; 3808 ->
  4220, now the top DPS spec on the All-time rail (Resto's 4420 healer benchmark above it).
  The calibration of record moved to 2.5% everywhere (lint registry + the buffed profile, one
  spec one calibration). CLOSED same day: the buffed re-run landed 5632 (crit rings, both stones
  intact; a 5563 first run with the off-hand stone accidentally stripped was retired unlanded).
  Warrior's buff-worth cells re-priced same day on the 5632 build (5 runs; the Base co-actor
  reproduced 5632 exactly): Consumables 269, PI 142, Drums 96, HM 163 (x1.03 signature holds),
  Skyfury 392, MotW 154, BS 0 own-cast. The raid-buff trio lands within 4 DPS of the old cells
  scaled by 5632/5137; the cooldown-window cells shift with the build's timing, PI 164 -> 142
  the largest mover.
- Consumables-deduction display ruling (2026-10-07, patches 283/284): made and reversed within
  the hour - "add the Consumables to the worth list calculation" meant something else; the
  display stays PI-only per the 2026-10-03 ruling. Banked from the detour: the fully-netted
  rail order (Fury 5221 display crown, Devour 3964 on the page's heaviest consumable load) and
  the stone-asymmetry visibility (melee Consumables cells understate by the baked stone).
- Stale headline dps fields (found 2026-10-07): entry.dps disagrees with dpsByList.alltime on
  two specs - Elemental 2355 vs 2397, Priest 4065 vs 4165 - both left behind by alltime re-runs
  that updated the list value only. Display-harmless (the renderer uses .dps purely as a sort
  tiebreaker behind dpsFor), but the data layer should agree with itself; fold into the hygiene
  batch.
- Site audit (2026-10-10, project doc claude/site-audit-2026-10-10.md): the full-site sweep.
  Headline repo items: 9 Herald lists wore class-illegal gear - SECTION 1 CLOSED 2026-10-10,
  all nine legalized in one morning: Ret 2768 (unchanged), Unholy 2237 (+16), Frost DK 2825
  (+2), Arcane 1967 (+1), Fire 2895 (-12), Frost mage 3184 (+3), Demonology 2262 (-17),
  Destruction 2509 (-18), Affliction 2848 (-22, also retiring one of section 9's off-engine
  stamps and restoring its missing snapshot_stats)
  (-17: Wings -> Mantle of the Corruptor 30215 + Torch -> Tide, both DBC-verified); Mage Frost
  CLOSED 2026-10-10 at 3184; Fire CLOSED 2026-10-10 at 2895
  (-12, the vers-to-crit trade costs Fire where Arcane gained one); Arcane CLOSED 2026-10-10 at 1967
  (Torch 40395 -> The Turning Tide 40396, same KT table); DK Frost CLOSED 2026-10-10 at 2825;
  DK Unholy CLOSED 2026-10-10 at 2237 (34601 + 34615, Sunwell trash). Catch of record: both DK
  first uploads renamed the shoulder comment but kept Destroyer's id - 2250/2838 held unlanded,
  single-token corrected inputs issued (id 34601, DBC mask 0xffff). Phantom sockets (section 2, IN PROGRESS
  2026-10-10): Cloak of the Coming Night (0 sockets - hunters + Enh clean: BM -22, MM -33 with a
  section-9 stamp shed, SV -14, Enh inside its rail re-price; the 2-gem crowd remains, 7 lists),
  Cloak of the Shadowed Sun (0 sockets, 5 lists - Ret's re-run kept its two). RULING of record
  2026-10-10: cloaks do NOT proc sockets - zero gems on 0-socket cloaks (Sub's 1-gem 1228
  intermediate retired unlanded; bare-cloak 1226 landed; Sub closes at -7). Eversong Cuffs
  CLOSED by ruling 2026-10-10: the wrist can proc a second socket, 1 native + 1 proc = the two
  gems are legal on all eight lists, no re-runs. Actionable remainder: 12 rows. The separate Dev-neck note (Tuskarr, 3 gems,
  the only multi-gem neck on the 54 lists) CLOSED by fix 2026-10-10: the neck drops to the
  native-socket convention (1 gem + proc badge), 2868 -> 2815. Correction of record: the first
  upload paired the old profile with the new build's sheet, so the prior "A/A exact, neck
  stands" reading (patch 314) was built on a mispairing - no evoker A/A exists, the -6 int was
  the two gems, and the evoker drift question is OPEN, not answered; the -53 move is consistent
  with gems alone (weak no-drift signal only). Also: 26
  page-vs-profile enchant mismatches + 2 gem rows, 67 socket-proc badges missing, Heartpierce's
  empty socket x6, and the linter gaps that let it all through (no enchant compare, ring/trinket
  gems skipped, no class/proficiency/socket checks, Full buffed unlinted in CI). Full triage
  parked - queue on Fate's call.
- Enh Vibroblade P_phys refresh (2026-10-10): the factor of record keeps P = 0.514 (carried,
  Fate's ruling at the 2351 landing); the 2026-10-10 run's own damage mix measures 0.490
  (MH 18.4 + SS 17.9 + OH 9.1 + WF 3.6 - Lava Lash grew). OPEN: applying it is -6 effective
  (x1.0610 -> x1.0581). U = 0.5694 stays carried from Outlaw either way. Related: the Enh rail
  (Herald/Obtainable/All-time) came current on today's engine 2026-10-10 in one commit after the
  Herald re-run inverted the pre-drift rail - the validator's monotonic gate caught it; buffed
  3724 was already current. The audit's Enh mastery-rating typo (100-for-10) fixed on All-time
  by the fresh sheet; the Full buffed pair still reads [*, 100] and stays on watch.
- Ret HoW calibration retune (2026-10-10, Fate's header note): with the overrides of record the
  merged HoW ratio now reads 0.966 game/sim; exact would retune 14488/1291900 from 2.91414 to
  ~2.81 (x1.304 instead of x1.35). OPEN - landed as-run at 2.91414. Provenance note: the stored
  09-26 Herald 2768 was stamped Raidbots Advanced while carrying these spell_data overrides,
  which Fate's header says Raidbots strips - yet today's calibrated local run lands the same
  2768 through a +/-1-rating gear wash, so either Raidbots honored them after all or the 09-26
  run was local under the wrong stamp. Today's stamp is local a0d9bbb either way.
- Priest VV re-runs: CLOSED 2026-10-03. The ruling retired the VV calibration block (the engine
  models Void Volley natively) and all four lists re-ran same day: buffed 5573 -> 5757,
  All-time 4065 -> 4165, Obtainable 3926 -> 3987, Herald 3589 -> 3487 - the Herald drop, the
  only gearless re-run, prices the old calibration premium at ~100 DPS.
- Burning Primal Diamond (76885) proven BiS on the DH head over the agi
  meta; sweep candidate against Mystical Skyfire (25893) on the other
  int-caster heads. The 76885 ban is shaman-scoped, as originally ruled.

Closed: A (per-spec confirmed; Dragonspine resolved universal by two-log
convergence — 3.5 and 2.7 both retired for 3.2), B (public), the rogue
Eskhandar spread (both tiers rescale to the one 2.47/min item anchor).

## Expanding to all DPS specs

The page renders spec entries, not classes: each CLASSES item is one
spec with `cls` (class key) and `primary` (the per-class ruling the
"Best per class" view shows — exactly one per class, enforced by
validate). The "All specs" toggle stops filtering; deep links to a
non-primary spec flip the view automatically; the rail live-sorts by
the selected list's DPS, so new entries place themselves.

Adding a spec is the same loop as maintaining one: three benchmark
profiles simmed at 50k, one page entry with `primary:false` (or a
primary flip if the per-class ruling changes), stats and talents from
reports, prov stamped, filenames carrying the simmed DPS. The linter
resolves profiles to entries by class name plus spec prefix, so
multiple specs per class lint without special-casing. Survival entered
through its gate on 2026-09-02: clean rebuild at current calibrations
(DST 103/3.2, hunters_mark restored, waist typo fixed), same-character
comparator inherent (both hunter profiles are Legacythirty), landing at
2626 vs MM's 3588 — MM's primacy untouched, SV published as hunter's
non-primary All-time entry. Augmentation
is the one roster spec the self-buffed rail cannot honestly number —
its kit buffs other actors — and needs its own ruling before it gets
an entry.

## Data shape

Rows: `slot, item, wowhead, ilvl, source, status`, optional `q, ench,
enchsp, gems, hm ("only"|"socket"), alts [{item, wowhead, q, delta}], why`.
New optional fields: `altbase` — the base sim DPS an alt sweep's deltas
were computed against (stamped when the sweep runs, so deltas stay
interpretable after a rebase); `prov` — a provenance stamp (sim date and
build) whose rendering is gated on ruling B.

## Engine of record

Ruled 2026-09-02: numbers of record come from Raidbots Advanced —
Fate's platform throughout the project and the one any reader can
reproduce. The local/parity midnight builds remain the calibration and
verification instruments (proc-rate rescaling, three-checks, stats
extraction; gear-derived stats are engine-identical). Cross-engine
deltas of a few percent are expected and are not drift; prov stamps
name the engine per number. Monotonicity is enforced per engine:
adjacent tiers on the same engine must order correctly, while a column
mid-migration may briefly invert — validate warns instead of failing
until the class's tiers share an engine again.

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

Every commit that modifies index.html also adds a dated CHANGELOG.txt
entry stating what changed — the page-facing record of ruling B.
CHANGELOG.txt is the single canonical file, served by the site and
linked relatively from the header. The
same commit sets CONFIG.notice to that newest entry's text: the header
notice is a mirror of the changelog's top line, and it links CHANGELOG.txt on the site.

Commit messages are prose paragraphs — what changed and why, with
flagged-but-not-applied items listed separately.
