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
| `index.html` | The site: one self-contained page, data included. Three views beside the lists: How to read this, All specs (`#all-specs`) and Buff worth (`#buff-worth`) |
| `list/All-time/`, `list/Obtainable/`, `list/Herald/` | The BracketSim runs behind the site's numbers, one pair per list: `<DPS> - <Class> <Spec>.simc` and its report `<DPS> - <Class> <Spec>.html`. A list the site still shows from Raidbots has no file here until it is re-run |
| `list/old/` | The Raidbots-era profiles: the self-buffed rail (`All-time/`, `Obtainable/`, `Herald/`), `All-time Full buffed/`, and `Dummy mode/` working copies. The numbers tagged "re-sim pending" on the site came from these; no check covers them |
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
