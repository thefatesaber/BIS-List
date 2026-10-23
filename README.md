# Fate — L30 BiS Compendium

Sim-validated best-in-slot lists for World of Warcraft at level 30: 27 specs
across all 13 classes, three lists each, every list fully raid-buffed.

**The site: https://thefatesaber.github.io/BIS-List/**

| List | What it holds |
|---|---|
| All-Time | Best in slot regardless of obtainability: removed, legacy and unobtainable items included |
| Obtainable | Best in slot among items that can still be farmed |
| Herald of the Titans | Best in slot under the achievement's rules |

Every number on the site is a SimulationCraft result, run on
[BracketSim](https://bracketsim.gg) with the site's raid-buff set. The exact
input of each run and its report are kept in `list/`. A number still from the
earlier engine (Raidbots) is tagged "re-sim pending" on the site until its
list is re-run.

## What is in here

| Path | What it is |
|---|---|
| `index.html` | The site: one self-contained page, data included |
| `list/All-time/`, `list/Obtainable/`, `list/Herald/` | The sim profile behind every number, one file per list: `<DPS> - <Class> <Spec>.simc` with its BracketSim report `<DPS> - <Class> <Spec>.html` beside it, or `.txt` for a Raidbots-era number not yet re-run |
| `list/old/` | Retired profiles: the self-buffed All-time rail, the Full buffed files replaced by a BracketSim run, and `Dummy mode/` working copies. Not lists of record: the site does not use them and no check covers them |
| The loose profiles in `list/` | Working copies that Fate keeps and uses; not lists of record either |
| `CHANGELOG.txt` | Every change, dated, newest first. The site's header shows the latest entry |
| `PROJECT.md` | Working notes: conventions, rulings and the record of each change |
| `validate.js` | Checks the page's data |
| `rebase_list.js` | Puts a BracketSim run (profile and report) on the page: number, talents, stats and rows of one list |
| `lint_profiles.js` | Checks each sim profile against its list on the page |
| `gamedata.js`, `gamedata.json` | The game data both checks read, and the script that rebuilds it |
| `stale.js` | Re-runs the stored profiles on a local SimulationCraft build, to spot numbers that have drifted |
| `diffdata.js` | Prints what changed in the page's data between two versions |
| `stats.xlsx` | A scratch sheet for comparing gem budgets |
| `assets/` | Icons and the share image |

## Checking a change

```
node validate.js index.html
node lint_profiles.js --page index.html "list/All-time" "list/Obtainable" "list/Herald"
```

Both run on every push and need Node and nothing else.
