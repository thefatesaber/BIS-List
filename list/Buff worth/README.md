# Buff worth runs

The Buff worth panels and the all-specs charts are built from minus-one runs on
BracketSim's Batch Sim (Run on My PC): one `.simc` file an entry and a buff, every
file the entry's profile with one buff switched off in BracketSim's option block
(raid buffs, Flame Cap) or in the profile's own lines (potion, flask, food,
temporary_enchant), plus a baseline with everything on. `make_batch.py` writes them;
`entries` is the list of (profile, actor name, page id, class, title).

Read the numbers from `summary.csv`, not from the HTML reports: Batch Sim splits the
20,000 iterations across the machine's cores and builds each report from the first
part only (646 iterations here), while the csv's `dps` is the mean of all parts.
A cell is baseline minus the leg; Hunter's Mark is not run (a flat 3%, so the number
of record x 3/103). The spec's own cast is run with SimC's override for the buff in the
file (`override.skyfury=0` and so on), since BracketSim's box may leave a buff the
character provides; a mage's precombat `arcane_intellect` line is removed as well.

- `2026-11-07 batch - summary.csv`: 614 files, every BracketSim entry (27 All-Time
  records, 20 All-Time builds, 15 Obtainable records). Its Havoc, Enhancement and
  Balance primary-buff legs tested the wrong buff; the Survival All-Time baseline lost
  its main-hand stone in that run.
- `2026-11-09 test10 - summary.csv`: the ten files that replace those: Havoc and
  Enhancement without Battle Shout, Balance without Arcane Intellect, the Survival
  baseline, and six checks.
- `2026-11-09 own casts - summary.csv`: the 24 own-cast cells (Skyfury on the shamans,
  Battle Shout on the warriors, Mark of the Wild on the druids, Arcane Intellect on the
  mages) and the three cells the first batch missed (the Enhancement builds' Battle
  Shout, Balance Nibelung's Arcane Intellect). The mages read 0 here: the override
  removed the raid aura but not their own precombat cast.
- `2026-11-09 own casts mages - summary.csv`: the eight mage files again with the
  precombat line removed; these are the mages' own-cast cells.
- `2026-11-09 bare and power infusion - summary.csv`: every entry run bare (every raid
  buff, Hunter's Mark and every consumable off, the own cast overridden) for the Total
  row, and with the Power Infusion box ticked for the Power Infusion row.
- `2026-11-09 power infusion without the rotation line - summary.csv`: sixteen entries
  (Balance, Survival, Windwalker, Demonology, Fury, Devastation and their builds) whose
  rotation carries its own `invoke_external_buff,name=power_infusion` line with a
  condition that never fires at 30; BracketSim honours the line instead of applying PI
  itself, so they read 0 to 1.6%. Run again with the line removed they read 2.5 to 3.8%
  like the rest; these are their cells.
- `2026-11-09 armor shred - summary.csv` and `... rerun - summary.csv`: every entry with a
  teammate's armor debuff on the target - Annihilator + Phantom Blade, Annihilator alone,
  Phantom Blade alone - written in the option block as `Teammate armor reduction: Annihilator,
  Phantom Blade` (a raw `bracketsim_ally_armor_shred=` line is NOT honoured by the batch;
  the block is). Two runs of the first pass dropped their stone and were run again.
- `2026-11-09 flame cap on non-fire specs - summary.csv`: the 44 non-fire entries run
  with Flame Cap ticked. Every cell is within 3 DPS of zero: BracketSim gives those
  classes nothing from it, so Flame Cap stays a fire-caster row. (The All-Time Survival
  file lost its main-hand stone in this run as in the first batch - a Batch Sim flake
  with a main-hand stone beside an off-hand rune; the ten-file run of the same file
  kept it, and that is the baseline of record.)

A multi-actor file (every entry as a co-actor under single_actor_batch) was tried and
rejected on 2026-11-09: in a many-actor sim SimC switches Chaos Brand and Mystic Touch
on when a Demon Hunter and a Monk are present, and BracketSim applies Drums and Hunter's
Mark to one actor only, so the casters read +2% and the rogues -1.5% against their records.
