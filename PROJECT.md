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
4855, rebuilt per the Server58 ruling) - no buffed profile predates Skyfury. Later the same day the PI wave itself closed: Feral, Survival, Outlaw, Arms, Unholy and Havoc re-ran on the template, so every buffed profile now invokes PI; Enhancement joined the same evening at 3415, completing the rail: 27 specs, all buffed profiles on the complete set. The rail then got its ledger: the Buff worth panel (buffWorth arrays in index.html, rendered on the buffed list only) prices Consumables, Power Infusion, drums-lust and Hunter's Mark per spec from minus-one-line A/B re-runs; statuses are measured or derived - the last five PI estimates became exact A/Bs on 2026-10-03 - Outlaw's rows are effective-scale, the priest's PI is its own cast. The claimed PI dead zone fell entirely on 2026-10-03 to Fate's fresh clean pairs - Arcane +99, Elemental +87, Balance +117; each old near-zero had compared the record against a held run that still carried the invoke. The queued seven re-ran the same day: Sub, Ret and Fury confirmed exactly; WW corrected 432 -> 113 (the board's largest artifact), Feral 175 -> 165, Havoc 115 -> 114, Demo 71 -> 106. All 27 PI cells now rest on Fate's own minus-one-line A/Bs - PI is worth 2.6-6.5% everywhere - and Monk passed Paladin on the PI-less rail, the only order change of the whole correction arc. Ruling 2026-10-03: the buffed list DISPLAYS PI-less DPS - dpsFor subtracts each spec's measured PI worth at render (bestOf and the rail sort follow it); the data layer keeps the sim numbers of record, and the priest's own-cast PI stays in its displayed number. The stat trio was priced 2026-10-05 in 12 runs (4 buff-legs x 3 calibration-isolated groups, all 27 specs as co-actors under single_actor_batch; profilesets cannot vary sim-scoped overrides, proven that evening): Skyfury 5-14% on melee via windfury and 1-2% mastery on casters (Resto a true 0), Mark of the Wild 2.4-2.9% everywhere, Battle Shout 4.7-4.8% / Arcane Intellect 2.6-2.9% with warriors and mages at 0 - own-cast like priest PI, the fourth and fifth members of that family. All 81 cells landed measured; the Base legs re-verified the whole stored buffed column within 2 DPS. Hunter's Mark followed the same evening - one MinusHM leg per group replaced the last 26 derived cells with measurements: every spec lands 2.86-2.94%, the exact signature of a flat x1.03 debuff read from the buffed side (1 - 1/1.03 = 2.91%); monk's lone pre-measured cell reproduced at 128, the priest corrected +6 off its stale base, hunters' cells carry the own-cast note, and no derived row remains anywhere in the panel. The panel's last five zero cells (warrior BS, mage AI - own casts) were priced 2026-10-07 by strip-the-cast legs (self-cast removed from the APL, override zeroed): own BS 4.7% for both warriors, matching the external band exactly - the override is faithful; own AI 4.4/4.3/5.9% for Frost/Fire/Arcane - a mage's own Intellect outprices AI on every other caster, int's budget share plus Arcane's Savant mana double-dip. Every cell in the panel now carries a measured value. Display ruling 2026-10-07 evening: the panel went collapsible (option C of three mocks) - component rows fold under the Consumables chevron, collapsed by default, same grid, renderer-only. Adds-up ruling, same evening: the Consumables parent is DEFINED as the exact sum of its component rows (tag TOTAL, pct on the children's denominator); the old joint-removal aggregates retired - they mixed eras (priest's was 5573-era, Devour's pre-drift) where the sums are same-run and current; the stone initially sat outside the total, then joined it the same evening - a visible child sums like one, and the melee understatement is finally in the headline cell (Fury 612, Assa 894, WW 817); the stone's note reads "baked into weapon stats". The pct column aligned the same way minutes later: the TOTAL row's pct is the sum of the children's displayed pcts, so both columns add exactly on all 27 panels - sweep-verified. Titles ruling, same evening (combo A): Buff worth in class-colored Cinzel with a fading hairline (--cc scoped onto the panel), siblings in dusty Cinzel. The Consumables cells began itemizing 2026-10-07: a Fury profileset pilot proved profilesets DO vary actor-scoped options (consumable lines, gear) - potion 63 / flask 148 / food 60 compose to 271 against the 269 aggregate, and the weapon stone priced at 341 (6.1%), outside the aggregate, quantifying the melee understatement; 26 spec files are out, casters splitting off their oils, melee their stones. 19 of 27 panels itemized by evening: 58 rows landed across 15 specs, every aggregate reconfirmed within 13 DPS by its components - stones are the largest single consumable wherever they exist (daggers 12.9%, fists/2H 5.6-10.5%), flasks the biggest bottle, Pandaren Epicurean visible in WW's doubled food. The drift confirmed on A/A re-runs of the untouched stored inputs (3724/3652/3903, agreeing with the split bases within 2): all three buffed numbers moved as engine corrections, profiles renamed content-unchanged, components landed - 22 of 27 panels itemized. Their pre-split cells stay priced on the old engine, re-pricing parked. The caster wave closed the same evening - 26 of 27 itemized, five caster bases exact, oils a tight 4.4-4.7%, Pandaren Epicurean across all three Pandaren toons, Resto's components summing 945 vs its 946 aggregate. Devour answered the same evening: A/A 5659 (split Base 5657, within 2) - the second intraday Devourer engine event, +7.8%, the server58 jump exactly. Buffed moved to 5659 and its components landed (dual oil 499, 8.8%, double the single-oil band) - 27 of 27 itemized, the campaign closed. The three lists answered the same evening: 3838/3689/2918, each exactly stored x 1.0779 - the drift is one uniform multiplier across the whole column, now current on the evening engine, and the panel re-priced the same night on the 5656 build - 7 runs, Base exact, HM printing the x1.03 signature to the digit (165), PI 302 -> 279 on the reworked meta window. No old-engine cells remain on Devour; Enh/Unholy/SV re-pricing stays parked. Shadow followed Devour's consistency play 2026-10-07: the buffed 5757 regems at an unchanged number (neck's third socket Lava Coral -> second Masterful Emerald, finger2 takes the Lava Coral back - gem totals and the sheet identical), and its 11-row panel heads into a full Devour-pattern re-evaluation on the new build. The panel answered 2026-10-08: 7 runs, Base 5754 (-3 on the stored number, run noise - the stored 5757 stands), Consumables 948 from components within 2 of the campaign cells, HM 165 printing the signature (2.87%), and the 5573-era cooldown pair finally current - own-cast PI 308 -> 329, Drums 184 -> 159. Every priest cell is measured on the regemmed build; no stale-era cells remain on Shadow. The site took its first full outside-in audit 2026-10-10 (project doc) - 16 sections from class-legality to WCAG - and the first finding fell the same day: Herald Ret's Warrior-only shoulders regeared to the paladin token at an unchanged 2768, stats moving one rating point. Unholy followed within the hour - both Warrior pieces out for Sunwell trash (34601/34615), 2221 -> 2237 - after the catch: the first DK uploads re-labeled the shoulder but still simmed Destroyer's id, so 2250/2838 were held and corrected single-token inputs issued; Frost's clean re-run landed the same hour at 2825 (+2) - the audit's section 1 stood 3 of 9 fixed within the hour, 4 of 9 by late morning - Arcane swapped the unswingable Torch for The Turning Tide (1966 -> 1967), Fire followed at 2895, paying 12 for the same legality; Frost mage closed the mage Torches at 3184 - 6 of 9, the Warlocks to come (the Torch stays legally on the five mace-caster lists). Demonology opened the lock wave at 2262, paying 17 for the double legalization - 7 of 9 - and Destruction mirrored it at 2509 (-18). Affliction closed the section at 2848 (-22) before noon: all nine audit-flagged lists legalized in a single morning of single- and double-token re-runs, every swap DBC-verified, the two half-edited DK uploads the only holds. Section 2 opened before noon: the three hunters returned the first phantom gems (BM -22, MM -33 with a section-9 stamp shed, SV -14). Enhancement followed and took the whole rail with it: its gem-less Herald rode the family drift to 2216 raw / 2351 effective (P_phys kept at the carried 0.514 by ruling, the measured 0.490 parked), inverted the pre-drift rail, and the validator's monotonic gate held the landing until the stored Obtainable and All-time re-ran verbatim - 2516 (+8.9%) and 2618 (+5.8%) - so all three landed in one green commit, the All-time sheet fixing the audit's mastery-rating typo on the way. The same hour Fate closed eight more audit rows by ruling: Eversong Cuffs' second gem is a wrist socket proc, legal as simmed. Devastation closed the audit's multi-gem-neck note the honest way - a mispaired upload briefly read as an exact A/A (patch 314), then the real file landed the neck at 1 gem, 2868 -> 2815, the -53 all gems, the evoker drift question left open. Sub then settled the cloak convention: cloaks do not proc sockets (zero gems - a 1-gem intermediate was held and retired), landing bare at 1226 and confirming the morning strips; the ruling binds the six 2-gem Coming Nights still out; Outlaw went first, bare at 2135 effective (raw 1933 -> 1915, the factor of record untouched), Assassination followed at 2301 (-23), Havoc at 1759 effective (raw 1676 -> 1665, its 0.474 factor untouched), Balance at 2229 - the campaign's largest return, 56 DPS of int-gem fiction - Feral at 2336 (-53, a near-tie), and WW closed the family at 2699 effective (raw 2472 -> 2420, Fate's own two-sided formula edit). Eleven Coming Nights bare in one day; the Shadowed Suns are all that stand between section 2 and done - Ret opened that wave the same hour at 2710, a -58 record, its morning stamp already current; Unholy followed at 2185 (-52), its third landing of the day. Frost DK made it a Death Knight pair at 2758 - -67, the audit's largest single return, two mastery corals of fiction. Arms followed at 2255 (-46), two Fierce Ametrines out, the same -4/-4 signature on str and haste. And Fury closed it: 2946, -56, the sixteenth row of sixteen - every phantom socket the audit flagged is off the site, and the strip doubled as the last warrior local stamp's retirement (2026-08-30 simc a0d9bbb -> Raidbots Advanced; the ledger reads six, not five - the audit's re-check caught Ret Herald's own same-morning move onto the local build, never counted). Section 2, opened before noon, closed the same afternoon. Section 3 opened at 14:20 on Fate's call - nine enchant re-sim inputs, the page's labels as ground truth, Crusader excepted - and Obtainable Fire answered first: 3430 to the digit with Major Spellpower actually simmed, the audit's coefficient-twin call proven, and the page's mislink (Major Healing's 33999 under a Major Spellpower label) finally pointing at 33997. Full-buffed Fire followed at 4825 exact - two of nine home, the buffed panel base undisturbed - while the All-time upload arrived as two spliced copies disagreeing only on the hands token, held for a clean re-send. Balance then exercised the rule's other branch: its crit-accord leg came back 2225, four under the stored haste accord - the first lower return - so the page relabeled to the winner, kept 2229, and shed its four Feral-leftover labels in the same stroke. Destruction followed the same branch: the Step leg 2506 (-3, a 3-crit-for-2-mastery sheet trade), Precision stands, the feet row relinked. Demonology echoed it at 2256 (-6, the identical signature) - the warlock pair done in one shape. Elemental broke the lower streak: its four Resto-shell enchant corrections came back 1941 (+15 on the 10-05 stamp), the section's first land-branch close - the labels were already honest, the profile just caught up. And Shadow's mastery-accord leg returned 5753 - noise against the 10-08 Base 5754 - so 5757 stands with its panel base intact, the rings relabeled; seven of nine resolved, Devourer's entangled -87 and the doubled Fire All-time the two holds. The Fire All-time re-send then came back clean - a single copy, Major Spellpower read off the report's own gear row - and 3565 stood to the digit: eight of nine resolved, Devourer the one left. The audit's S2 followed and settled the Ret provenance doubt: the stored Herald profile ran verbatim on Raidbots at 2711 against the local 2710 - the calibration overrides are honoured, the header's 'Raidbots strips these' retired, Herald moved onto the engine of record and the off-engine ledger fell to five, with All-time 3111 and Obtainable 2900 one verbatim run each from following. S3 opened the same way: Marksmanship All-time ran verbatim on Raidbots at 3588, the local 08-30 number to the digit - ledger four. Marksmanship Obtainable followed at 3451 against the local 3450 - ledger three, the hunter column whole on the engine of record. Resto Herald closed S3 as a repair: verbatim it matched (3685 against the local 3684), but its Ascendance line had never bound - the name fixed on Obtainable in September - and Fate's corrected file landed 3788, +103; ledger two, both Ret. Then Fate answered the audit's Crusader question by running it: Fury Obtainable with the ring procs of record came back 3816, +600 on the 09-22 number, the drop from All-time cut from 23.8% to 9.6%. Herald followed at 3498, +552 on this morning's clean base - the same 18.7% both times, which also clears Obtainable's September stamp of engine drift. The audit's S5 fell to a ruling instead of a run: Heartpierce is the normal version on these lists - the heroic's effect does not work - and the normal has no socket, so the 'empty socket' was the page linking the wrong twin; six rows relinked, nothing re-simmed. S6 opened in the evening: Devastation Herald on rank-3 Spellthread, 2824, +9 for one Intellect. Resto Herald took the same token for 3799, +11. Resto Obtainable closed S6 at 4257, +13 - the last rank-1 Spellthread on the site. S7 went to an A/B: Feral All-time verbatim reproduced 2770 to the digit, the page's Crimson Spinel rings came back 2765, and the two ring rows relabeled to the Deadly Pyrestone that was simmed. S2 finished the night's work: Ret All-time verbatim on Raidbots, 3110 against the local 3111. Ret Obtainable followed at 2901 against 2900 - the off-engine ledger at zero, every number on the site a Raidbots number. The professions ruling carried the next morning (2026-10-11, patch 349): where the scribe-only shoulder inscription is better the lists use it, so twelve specs moved from Greater Axe/Storm to the Master's version - 45 lists in 23 Raidbots runs, Obtainable and Herald riding as profileset arms of their All-time list, each swap worth +3 to +13 against its control arm; Survival's control also exposed +22 of engine movement on its two oldest stamps. Patch 350 took the sweeps' second finding the same morning: Frost and Unholy DK dropped Lionsmane, the lowest strength inscription in the engine, for Master's Axe on their six lists (+13 against the control on both All-time lists) - and the control showed Frost All-time's stored 3332 no longer reproduces (3252 unchanged), so the list lands at 3265. Every list now wears a Master's inscription. The rulings pass followed the same day, Fate deciding D2 to D7 from questions and mock-ups. Patch 351 (D2): each list states the professions it assumes - a line under its description, Scribe only on the shoulder inscription, Crafter only on the four bind-on-pickup Sunwell chests, all derived from the rows at render. Patch 352 (D3): the Consumables panel reads 'Not included in the DPS shown' on the three lists whose profiles disable them. Patch 353 (D4): the seven Vibroblade numbers wear an 'effective' tag with the raw figure a tap or hover away, fed by a new rawByList field that validate.js ties to the off-hand note and to dpsByList. Patch 354 (D6): the unlisted Augmentation entry says 'Preview, number pending' in the open. Patch 355 (D5): every list shows its sim date beside the number. Behind its second half - re-run only what moved - a local screen of the 57 lists not simmed that day found four that no longer reproduce and explained the bracket's drift: SimC's game data was retuned on 2026-09-22 and 2026-10-06, and the lists that moved are ones whose spec a wave touched after their stamp (Frost Mage Obtainable, Devastation All-time and Obtainable; the earlier Enhancement and Frost DK moves fit the same two dates) - not every touched spec moves at level 30, Affliction and Restoration reproduce - while Arms All-time's 2703 had never been run on its committed profile. Those four went back to Fate as S9, with the Windwalker lists minus Touch of Death (D7) as S10. S9 came back within the hour and landed as patch 356 - Arms All-time 2546, Frost Mage Obtainable 3555, Devastation 3291 / 3148, each within 1.3 of the local reading - closing D5: every list is either simmed that day or reproduced within 1.7 DPS. S10 followed as patch 357: with Touch of Death out of the action list the four Windwalker numbers read 4438 / 2896 / 2783 / 2693 (Herald raw 2414), each within 1.2 of the local reading - D7 closed, and with it the rulings pass. The audit's page-data items (P1 to P17) opened the same day on Fate's call. Patch 358 (P1 to P3): seven enchant labels follow the sim - Devourer Herald's rings read Accord of Haste, the two rogue Herald off hands show Gale-Force Striking, and Crusader shows on the last three main hands that simmed it unlabelled - closing audit section 3 with no number moved. Patch 359 (P4, P5): the Socket Proc badge went onto the 89 rows that showed a proc-socket gem without it - 67 necks and rings on Obtainable and Herald, Survival's helm and bracers, Eversong Cuffs on eight Herald lists and the six Timewalking rings on Full buffed - and came off one three-gem neck, so it now marks exactly the rows one gem over their item's sockets. Patch 360 (P6, P7): two enchant links - Greater Agility on 40 Feet rows moves from the gloves spell to the boots spell, and Waking Stats on 101 Chest rows gains its spell id, so the row shows a tooltip instead of opening a search. Patch 361 (P8): the Consumables panel gains Unholy's two missing lists and stops naming an off-hand weapon buff on Arms and Devastation; ten Full buffed profiles gain an explicit temporary_enchant=disabled, each proven identical by fixed-seed A/B. The same proof found the eleventh is not a no-op: Feral Full buffed has been simming SimC's fallback Thalassian Phoenix Oil, worth 88 DPS of its 4073 on the local build - held for a run. Patch 362 (P10, part of P11): 23 source labels name their boss (Heartrazor, Arcanite Steam-Pistol, Heartpierce, Meteorite Crystal) or lose a stray '(Anniversary)' (The Untamed Blade on Arms), and Fury Obtainable's self-named off-hand alternate is tagged 'second copy'. P9 was not applied: the Nibelung notes turned out to be Fate's own, written after the removal. Patch 363 (P12, P13): the Balance and Shadow All-time stat panels take the mastery their profiles actually give (21.95% at 106; 15.03% at 110), so all 109 panels now match their profile's sheet; the two stale dps fields follow their All-time number; eight rare gems stop rendering as epic. Patch 364 (P14): the share image is redrawn in its own design to say 27 specs, 13 classes, four lists and patch 12.1.0, the meta and og descriptions follow, the first tab reads 'All-Time Full buffed', and the fallback notice stops announcing 'seven specs landed so far'. Patch 365 (P17): 24 sim profiles lose their stale labels - a misspelt cooldown, a disproved header note, seven stray name= lines, eleven multi-socket bonus ids on one-gem jewellery, the inert enchant_id=1900 on seven Crusader weapon lines - and two Affliction profiles gain a stat sheet; every file sims identically to its previous version, fixed seed, to the last digit. Left for a run: Meteorite Crystal's proxy on three Devourer lists is 1 Intellect short of the item at its page level. S11 came back the same day. Patch 366: Feral Full buffed without the fallback oil reads 3986 on Raidbots (from 4073; the local build had said 3986), its panel gives back the oil's 7 crit and 7 haste rating, and all 109 profiles now close off the fallback weapon buff in writing. Patch 367: Devourer's Meteorite Crystal proxy takes the page's item level (43 and 9 Intellect, from 41 and 8), and Full buffed, All-time and Obtainable read 5670, 3850 and 3700 on Raidbots (from 5656, 3838 and 3689), the run's control arm reproducing 3838. The same day Fate ruled that the Nibelung note stays and read two tooltips, Heartpierce 46 and Abracadaver 45 (patch 368): Icecrown is 45 / 46 / 47 for 10-heroic / 25-normal / 25-heroic, three Full buffed Abracadaver rows are over-pinned at 47 and, by the same scale, so are the 24 rows of Plague-Soaked Leather Leggings; both went out as S12. S12a came back within the hour (patch 369): Shadow, Affliction and Devastation Full buffed read 5705, 4635 and 4417 with Abracadaver at 45 (from 5757, 4675 and 4456, the control arms reproducing the stored numbers within 1), Abracadaver is 45 on every row, and its entry is out of ILVL_SPLIT_OK. S12b followed (patch 370): Plague-Soaked Leather Leggings sit at 45 on all 24 rows, each list 11 to 35 DPS lower with its control arm within 1 of the stored number, which closes S12 and leaves every Icecrown 10-heroic row at 45. The page-code pass opened the same day (patch 371): "Best per class" follows the class's best spec when the tab changes, the view toggle is drawn from state, and a link's class segment matches the class key, so #deathknight/unholy/herald opens Unholy. Patch 372 took the sideways scroll out at every width (all 109 views overflowed between 861 and 900 px, which the audit's six widths had missed): the pane line stacks below 1181 px, Buff worth notes wrap, and consumable icons are 24 px. Patch 373 gave the view toggle the border and font its rules had been asking for through two undefined variables. Patch 374 capped the main column at 1400 px, made the stat chart's scale follow the data (80, after Windwalker's 76.54% mastery outgrew the fixed 75), and gave the talent string a fade where it runs out of its box. Patch 375 made the Buff worth expander a button, exposed the three selections to assistive technology and added a skip link. Patch 376 took Wowhead's script and the font sheet off the critical path (a hung host used to leave the page blank) and made an arrival on a link count as a view of the list it names. Patch 377 removed the page's dead code and left its two unused pieces of data, the status field and the class notes, for a ruling. Patch 378 cut the header notice's download from the whole changelog to its first 4 KB. Patch 379 moved the row-stacking breakpoint from 860 to 700 px, so tablets and narrow windows keep the table. Patch 380 put the enchant and the gem names on the phone's rows (ruling M1, M2). Patch 381 dropped the empty Off Hand row from the 60 lists with no off hand (ruling C5). Patch 382 added a key to the badges under each list and to the tags under Buff worth (ruling M4). Patch 383 gave each view its own history entry, so Back steps through views (ruling O2). Patch 384 lifted the grey text to 4.5 to 1 and deleted the icon ring rule; class colours stay official (rulings L1, L4, L2). Patch 385 dropped the status field from every row (ruling D10); the class notes stay hidden (D11). Patch 386 renamed the page's quality classes so Wowhead's style sheet no longer repaints rare names; they keep the lighter blue (ruling D9). Patch 387 put the Full buffed folder under CI and made its weapon-buff line mandatory (T3, T8). Patch 388 put game data on file (gamedata.json) and held every row to it: class, weapon type, slot, sockets and badge, names, enchant links, the two profession tables (T2). Patch 389 moved Herald's era rule from the source text to the item id, held Icecrown drops to their difficulty's level, required all four lists on every listed spec, and turned the item-level exceptions into data the validator prints (T5, T9). Patch 390 made the linter compare every gear line with its page row: level, gems and enchant, rings, trinkets and proxies included, Crusader by its ring rule (T1, T4). Patch 391 listed the weapon stone on the 13 melee Full buffed Consumables panels and corrected it on six rogue panels (P8, ruled). Patch 392 relinked the six druid Umbrage Armbands rows and profile lines to the heroic, with a one-name, one-level, one-id rule in validate.js (ruled). Patch 393 recorded the evening's other eight rulings, dropped the alternates-note warning and deleted todo.txt; fifteen runs went out as S13 to S16 and S18. Patch 394 added stale.js, the staleness screen as a script (T7): 108 of 108 listed profiles within 2.5 DPS on the day. S13 landed as patch 395: Arms, Havoc, Enhancement and Unholy each on a proc rate solved for the spec (16 lists, eight control arms within 1 DPS), Havoc and Enhancement Herald on refreshed Vibroblade shares, the linter's registry keyed by spec (T6), and the Jackhammer's anchor recorded at what 2.5% realizes. S14 followed (patch 396): Feral Full buffed back on Mighty Agility, 3957 to 4028. S15 (patch 397): Demonology's potion and racials lines open to a build without Tyrant, 3690 / 2763 / 2650 / 2274. S16 (patch 398): Retribution's Hammer of Wrath at 2.81, 4303 / 3106 / 2895 / 2702. S18 (patch 399): Devourer Herald 2943 on Mystical Skyfire, and Elemental Herald 2025 on Burning Primal, the Desolation proxy and its own gems, which closes the meta gem sweep; S13 to S18 are all landed. Two answers the same evening (patch 400): four Herald lists get a run on their own spec's gems (S20), and the Desolation token is 12crit for every spec, Elemental re-run at 12 (S21); with S19 that is eight runs out, and a ninth, S22, on a lead the survey left: Feral Obtainable wears no Blasphemite. All nine came back at 00:11 on 10-12, with two answers: the helm's 2-piece reads 12 in game, and Feral Obtainable takes both regems (D28). S19 (patch 401): Restoration 6038 / 4492 / 4339 / 3871 with the token. S21 (patch 402): Elemental 3240 / 2392 / 2297 / 2021 at 12, and the linter holds the token on all 29 profiles that wear the pair (T10). S20 (patch 403): four Herald lists on their own spec's gems, Fire 2970, Assassination 2345, Subtlety 1259, Fury 3524. S22 (patch 404, D28): Feral Obtainable 2662 with a Blasphemite in the helm and Feral Herald's Deft Ametrines; S19 to S22 are all landed. Three answers on 2026-10-12 (patch 405): the Desolation 4-piece stays out of the model (D29), the alternates are re-read like for like on their lists as they stand (D30; S23, ten runs out) and four weapon rows keep their sweeps of record (D31); found on the way, a flat +8 Haste socket bonus on six items that 76 lists wear. S23 (patch 406): the ten runs came back and 37 alternates on 24 rows take their deltas and bases from them, which closes P11; six staff alternates turn out within noise of Abracadaver, and validate.js now holds a row's sweep base to its list (T11). The Frost landing also proved the lint id-check earns its keep: the first cut flipped another entry's row and the gate threw the exact mismatch pre-delivery. The Obtainable wave closed 2026-10-03: all 14 sub-specs landed in one day from candidates built under the rules the 13 main lists established - farmable-in-Midnight items only (Anniversary BRD and the swapped jewelry are the bans) and native sockets only on neck and rings. Every spec now carries All-time, Full buffed and Obtainable. The Herald wave closed the same day: all 14 sub-specs landed under the Herald rules (ilvl <= 41 every slot, Classic/TBC/WotLK armor and weapons, jewelry era-exempt, 50k iterations), completing the grid - every spec carries all four lists. The completed grid then survived its first full logical audit (2026-10-03): chains, off-hands, era/ilvl legality, obtainable bans, duplicates, jewelry sockets, profile-vs-page gear and talents all clean page-wide, and the five findings all resolved - WW Herald's effective conversion moved to its own measured physical share (2762 -> 2757, P 0.969 -> 0.973), the three Outlaw numbers decoded as already-effective from Fate's re-runs (2218/2121/1932.9 raws reconstruct 2473/2365/2155 exactly; stale comment blocks rewritten, no number moved), SV Herald's stored profile came current at 50k (2309 reconfirmed), and the DH Devour Herald trinket race paid out +160 (ToEP -> PotVE solo, 2547 -> 2707). Every other
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
Real enchants use `enchant_id` only, everywhere. The standing case is the
Desolation pair (Helm 28192 + Pauldrons 27713): set 660 is missing from
the engine's set-bonus registry, so every list that wears both carries the
2-piece on the head as 12crit (15crit on Survival Full buffed, with its
stone). 12 is the value for every spec, ruled 2026-10-11 (D27), and it
is the game's own tooltip at level 30, read by Fate on 2026-10-12.
Wowhead's tooltip reads 13 there (spell 37609); the game decides.
Restoration's four lists took the token with S19 (patch 401) and
Elemental's four came down from 13 with S21 (patch 402). All 29 profiles
that wear the pair carry it, and `lint_profiles.js` holds it (T10).
The set's 4-piece is not modelled, by ruling (D29, 2026-10-12): per
Wowhead it is a 1% chance on attacks of Heroic Resolution, 25 Agility
for 15 s at level 30, and no log anchors that rate. The seven Herald
lists that wear four pieces carry the 2-piece token and nothing more.

**Proc calibrations: log anchors, per-spec encodings.** Every calibrated
proc has a live anchor in procs/min, measured from WCL buff tables
(applications ÷ fight minutes). The engine encodings are then solved by
running the profile, reading sim procs/min from the buff table, and
rescaling linearly — twice, because haste procs feed the attack-event
stream and the first pass lands ~5–12% under anchor in the corrected
environment. Anchors of record: Dragonspine warrior 2.47/min + DK
1.8/min (the two independently solve to the same per-event chance, so
the trinket is universal: 103 haste payload per tooltip, 3.2% on every
spec); Untamed warrior 12.4/min; Jackhammer warrior about 9/min (what
the 2.5% of 2026-10-07 realizes; Fate, 2026-10-11 - it was 4.5/min
before, and no log figure is on file); Bonereaver warrior 27.6/min +
DK 11.0/min; Eskhandar 2.47/min; Crusader ring encoding warrior
20.4/min combined; Destiny 13/min. Frozen encodings, one per spec:
DST 3.2 everywhere; Untamed Fury 3.7 / Arms 18.2 / paladin 19.6;
Jackhammer 2.5 (1.3 until 2026-10-07); Bonereaver Fury 9.8 / Frost 8.6
/ Unholy 20.9; Eskhandar Windwalker 0.88 / Outlaw 0.4 / Havoc 0.63 /
Enhancement 0.41 ppm; Crusader warrior 3.0 per ring / paladin 16.2.
Arms, Havoc, Enhancement and Unholy were solved on 2026-10-11 (S13):
until then each carried another spec's encoding. None of the four has
a log of its own; Unholy's anchor is the DK one. The linter's registry
holds the encodings by spec and fails a spec without an entry. The
paladin values are warrior-derived (same 2H swing rate); one paladin
log hardens or corrects them. Weapon chance-on-hit rates stay per-spec — sim
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
Server58, 2026-09-26). Abracadaver (51887) was a third entry with no such
reason until 2026-10-11: the game shows 45 (Fate's tooltip), and its three
Full buffed rows at 47 were re-run at 45 (patch 369). A pin above an
item's base ilvl is only legal if
that version actually exists in-game: raid items need the raid-difficulty
Item Versions (Wowhead's Versions column), and a crafted piece with no
higher version cannot be pinned up at all — relic-only wrists cap at 28
(Server58's review, 2026-09-24). Check versions before pinning, not after.

**Consumables are closed off.** `temporary_enchant=disabled` (not `none`,
never blank — a blank field triggers the fallback) and
`augmentation=disabled` in every per-actor block (blank falls back to an
augment rune). A missing line is not harmless: the druid and evoker
modules fall back to Thalassian Phoenix Oil at any level, and Feral Full
buffed simmed it for 87 DPS until 2026-10-11 (patch 366). To test such a
line, put it in the actor's block: appended after `enemy=` it applies to
the enemy and changes nothing.

**Known engine traps.** Brutal Earthstorm Diamond (25899) in any non-weapon
slot segfaults via a nullptr in `enchants.cpp:168` — Feral uses Relentless
Earthstorm (32409). Restoration's meta is Mystical Skyfire (25893); any
76885 in a Restoration export is replaced, and the linter holds that.
Elemental wears Burning Primal (76885) on all four lists. `howling_rune`
needs a rank suffix. `use_off_gcd=1`
for precise on-use cadence; `default_item_group_cooldown=0` prevents the
shared 20s item-group starvation. Sim-wide overrides precede the actor
declaration. Hero-tree talent references compile to 0 at level 30 — routing
gated on them must be collapsed, not just deleted. `override.spell_data`
cannot fix values hardcoded in module C++ (Lava Surge rate, Resto LvB crit
scaling) — `line_cd` tuning is the workaround.

**Standing item decisions.** Distant Land is the 3-socket 50695, never the
2-socket 50040. Crusader on paladin/warrior weapons: the page shows it on
the weapon row, the profile sims it as a ring proc, and the weapon line
carries no `enchant_id=1900` (the token creates nothing in SimC; a run is
identical with or without it, proven on all twelve lists 2026-10-11). Major
Spellpower on DH weapons via `enchant_id=2669`. Heroic Solace (47432) as shaman trinket 1.
Icecrown Citadel at level 30: 10-heroic drops are 45, 25-normal 46,
25-heroic 47 (Fate's difficulty rule of 2026-09-10 and his tooltips of
2026-10-11: Abracadaver 45, the normal Heartpierce 46). The id block names
the difficulty: heroic-flag items sit at 506xx-507xx (25-player, e.g.
Distant Land 50695) and 518xx-519xx (10-player, e.g. Abracadaver 51887),
each paired by name with a normal twin at 499xx-504xx or 507xx-510xx.
Wowhead shows the same scale under bonus ids 9048 to 9051 (44 to 47); a
tooltip with no bonus id reads 47 for all of them and settles nothing.
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

**Windwalker.** No `touch_of_death` in the action list (ruling D7,
2026-10-11). On the sim's fixed-length boss fight the action fires at the
very end in 13% to 42% of iterations depending on the run's seed, so the
number carried a run-to-run spread of about 5 DPS either way that more
iterations did not remove. The two lines (`default_st`, `multitarget`) are
out of the four list profiles and a comment marks the spot. An action-list
re-sync from upstream must not bring them back.

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
  CLOSED on the record (noted 2026-10-11): Fate's re-run of 2026-10-03 printed D0 = 2218,
  so the stored 2473 was already effective (the profile's CONVENTION AUDIT comment). All
  four Outlaw lists are effective numbers; rawByList holds the raw results (3738 / 2200 /
  2109 / 1919) and validate.js holds them, dpsByList and the off-hand note to each other.
- Demonology's of-record APL gates its racials call and potion line on
  pet.demonic_tyrant.active, dead at 30 (the build cannot reach Tyrant,
  proven 2026-09-30 by the buffed PI runs) - they only fire at fight's
  end. Adding |!talent.summon_demonic_tyrant would fix both but moves
  the All-time 2751 benchmark, so it needs its own ruling and re-runs.
  RULED 2026-10-11: apply the fix (over keeping the action list of record). Local build:
  Full buffed 3659 -> 3690, All-time 2750 -> 2762, Obtainable 2638 -> 2650, Herald 2262
  -> 2274. Inputs issued as S15, two runs: All-time with Obtainable and Herald as arms,
  and Full buffed. Each control arm restates the stored default action list.
  LANDED 2026-10-11 (patch 397): 3690 / 2763 / 2650 / 2274 on Fate's runs, both control
  arms exact. The benchmark is 2763 and the item is closed.
- Paladin Untamed 19.6 / Crusader 16.2 are warrior-derived inferences —
  a single paladin log (buff applications ÷ minutes) hardens them.
- DK Roccor-vs-Chaos alt sweep (Monk Herald and DH Herald trinket closed by the 2026-10-03 audit).
  ANSWERED 2026-10-11 on the local build: on the All-time lists Heart of Roccor leads Chaos
  Talisman by 61 on Frost (3264 against 3203) and by 56 on Unholy (2545 against 2489). Both
  lists already wear Roccor, so nothing moves and no run of record is needed. Chaos Talisman
  stays the Obtainable pick: Roccor's raid is gone.
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
  RULED 2026-10-11, both. (2) The stone goes on the 13 Full buffed Consumables panels (patch
  391) and the bake stays as simmed. The fold-in half was already done: on all 13 lists the
  Buff worth Consumables total equals potion, flask, food and stone. Left as simmed by the
  ruling, with what each correction reads on the local build: Enhancement's helm without the
  two stones' crit (18crit for 12crit, +34), Retribution's blade at 31-43 for 32-44 (+20),
  Heartpierce's off hand at 19-27 for 22-27 on Assassination (+13) and Subtlety (+4).
  (3) Mighty Agility on every list, the report's swap turned down. Wowhead reads +15 Agility
  against +2 weapon damage, as the engine does, and Superior Impact costs 78 to 124 DPS on
  the seven lists that wear Mighty Agility (Feral x3, Survival x4). Feral Full buffed alone
  wore Superior Impact and counted it twice: baked into the staff (39-47, where Survival's
  same staff is 37-45) and again through enchant_id=1896, which the engine applies by itself
  (37 DPS). It goes back to Mighty Agility with the stone alone in the staff: local 3957 ->
  4026. Input issued as S14, one run with a control arm; the row is relabelled at landing.
  LANDED 2026-10-11 (patch 396): 3957 -> 4028 on Fate's run, the control arm at 3957. All
  eight lists of Feral and Survival wear Mighty Agility, and item (3) is closed.
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
  OPEN POINT, found 2026-10-11 while reading every calibrated proc (T6): the anchor of record
  is still 4.5/min. On the local build the All-time list realizes 9.2 Jackhammer procs a
  minute at 2.5% (Full buffed 9.8), and Untamed rises to 13.6 against its 12.4. At the old
  1.3% the same list realizes 4.4 and 12.5 and reads 3808, its number before the
  recalibration. So 2.5% is twice the anchor on file, and the log figure behind it is not on
  record. Fate to state it: either a new anchor near 9/min goes into the Standing ruling, or
  4.5 stands and Fury's All-time and Full buffed lists are re-solved (at 1.3% the local build
  reads 3808 and 5134 against the stored 4220 and 5632).
  CLOSED 2026-10-11 (ruling D24): 2.5% is the calibration. The anchor moved with the re-run
  of 2026-10-07 and is recorded at what 2.5% realizes, about 9/min; no log figure was given.
  Fury keeps 4220 and 5632.
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
  CLOSED 2026-10-11: patch 363 set both fields, and validate.js fails a dps field that is not
  dpsByList.alltime (patch 389).
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
  single-token corrected inputs issued (id 34601, DBC mask 0xffff). Phantom sockets SECTION 2 CLOSED 2026-10-10,
  16 of 16 actionable rows re-run in one day: Cloak of the Coming Night, all eleven rows bare
  (hunters/Enh first, then Sub -7, Outlaw/Havoc/WW on their effective scales, Assa -23,
  Balance -56 the cloak record, Feral -53; sheets exact throughout); Cloak of the Shadowed
  Sun, all five bare (Ret -58, Unholy -52, Frost DK -67 at 2758 the audit's largest single
  return, Arms -46, Fury -56 at 2946 - Fury's strip also retired the last warrior local
  stamp, 2026-08-30 simc a0d9bbb -> Raidbots Advanced; ledger at SIX, not five - the audit's
  re-check corrected the count: Ret Herald's same-morning move ONTO the local build was
  never counted). RULING of record
  2026-10-10: cloaks do NOT proc sockets - zero gems on 0-socket cloaks (Sub's 1-gem 1228
  intermediate retired unlanded; bare-cloak 1226 landed; Sub closes at -7). Eversong Cuffs
  CLOSED by ruling 2026-10-10: the wrist can proc a second socket, 1 native + 1 proc = the two
  gems are legal on all eight lists, no re-runs. Counter of record: the running tallies
  since Sub had absorbed the separate Dev-neck close (never one of the 16); corrected at the
  Frost DK landing, and the section closes at exactly 16 of 16. The separate Dev-neck note (Tuskarr, 3 gems,
  the only multi-gem neck on the 54 lists) CLOSED by fix 2026-10-10: the neck drops to the
  native-socket convention (1 gem + proc badge), 2868 -> 2815. Correction of record: the first
  upload paired the old profile with the new build's sheet, so the prior "A/A exact, neck
  stands" reading (patch 314) was built on a mispairing - no evoker A/A exists, the -6 int was
  the two gems, and the evoker drift question is OPEN, not answered; the -53 move is consistent
  with gems alone (weak no-drift signal only). Also: 26
  page-vs-profile enchant mismatches + 2 gem rows, 67 socket-proc badges missing, Heartpierce's
  empty socket x6, and the linter gaps that let it all through (no enchant compare, ring/trinket
  gems skipped, no class/proficiency/socket checks, Full buffed unlinted in CI). Section 3 OPENED on Fate's call 2026-10-10: re-sim each
  mismatched list with the enchant the page shows, Crusader rows excepted - nine inputs issued
  14:20, table in the audit doc. Fire's trio first back, the coefficient-twin call holding:
  Obtainable 3430 and Full buffed 4825 exact (hands 2322 -> 2937, page mislinks 33999 -> 33997,
  stamps current; the buffed number holding keeps its Buff worth panel base current); the
  All-time upload arrived DOUBLED (two spliced copies disagreeing only on the hands token)
  and was held; its clean re-send CLOSED the trio the same day at 3565 exact (patch 335: hands
  2322 -> 2937, mislink 33999 -> 33997, stamp 2026-09-23 -> 2026-10-10; Fire is now current
  on all four lists). Balance Herald CLOSED by the
  rule's relabel branch: the crit-accord leg returned 2225 (-4, a clean same-day A/B - the
  sheet swaps exactly 4 rating crit-for-haste), 2229 stands, the ring relabeled to the
  winning Accord of Haste, and the four Feral-leftover labels (wrist/hands/legs/feet) came
  right with it. Destro Herald CLOSED by relabel (the Step leg 2506, -3 - the sheet trades 3 crit rating for
  2 mastery; Precision stands, page relinked 104414 -> 74236). Demo followed identically (2256, -6, the same
  signature; relabeled). Elemental Herald CLOSED by the land branch - the only riser: its four
  Resto-shell enchants corrected to the page's own (Master's Storm, Belt Clasp, Spellthread
  r3, Precision), 1926 -> 1941 on today's engine, stamp current, no page-row edits needed.
  Shadow Full buffed CLOSED by relabel: the mastery-accord
  leg 5753 (-4, noise against the 10-08 Base 5754), 5757 stands with its re-priced panel
  base intact, both rings relabeled to Accord of Haste. Devourer Herald alone remains, HELD:
  its leg returned 2831 against the stored 2918 (stamp 2026-10-07) - the -87 entangles the
  accord price with three days of engine movement on the family that has already moved twice
  intraday; the sheet's clean +-8 haste/mastery swap clears the gear side, and a verbatim
  A/A of the stored 2918 separates the rest (A/A near 2918 = the accords really cost 87,
  relabel; A/A near 2831 = engine drift, the family may need the rail treatment). The rest of the triage (badges, Heartpierce, the rogue off-hand labels, linter
  gaps) stays parked.
  Section 9 (off-engine stamps) MOVING 2026-10-10 on verbatim Raidbots runs of the stored
  profiles: Ret Herald 2711 (local 2710; patch 336), Marksmanship All-time 3588 exact (patch
  337; sheet digit-identical, stamp 2026-08-30 a0d9bbb -> 2026-10-10 Raidbots Advanced),
  Marksmanship Obtainable 3451 (local 3450; patch 338, sheet digit-identical, same stamp
  move) - Marksmanship is on Raidbots on all four lists.
  Resto Herald: verbatim 3685 against the local 3684, then REPAIRED and landed at 3788 (patch
  339) - its APL fired use_item,name=ascendance_buff while the tabard is ascendance_buff_proxy
  (the unbound name fixed on Obtainable 2026-09-23; Herald was the last Resto list with
  Ascendance inert): +103 same engine, same day, sheet digit-identical; a stray name=Shaman
  line went with it. S3 CLOSED.
  Ret All-time: verbatim 3110 at 100k against the local 3111 (patch 347; number, stamp and the
  profile's header note moved; no sheet sent, panel carried).
  Ret Obtainable: verbatim 2901 at 50k against the local 2900 (patch 348; same moves).
  Ledger ZERO - section 9's off-engine table is CLOSED and the audit's S2 with it: every
  published number carries a Raidbots Advanced stamp, Ret is on Raidbots on all four lists,
  and the local build is an instrument only again. Still carrying the old 'Raidbots strips
  these' header: Ret Full buffed 4310 and the Dummy mode profile.
  Crusader rows (the audit's D1) RULED BY ACTION 2026-10-10: Fate ran S4 - both rings gain
  the warrior Crusader proc of record (attack_37str_15dur_3.0%), nothing else changed. Fury
  Obtainable 3216 -> 3816 (+600, +18.7%; patch 340, sheet digit-identical, stamp 2026-09-22
  -> today; its two trinket rows' alternates keep sweep base 3216). Fury Herald 2946 -> 3498
  (+552, +18.7%, a clean same-day A/B; patch 341, sheet digit-identical). Equal relative gains
  on a 09-22 base and a 10-10 base = Fury Obtainable had not moved on the engine. All four
  Fury lists sim Crusader; section 3's four Fury rows (page shows an enchant the sim lacks)
  are CLOSED. Left of the Crusader thread: the label on three main-hand rows that already
  sim it (Arms Full buffed, Arms Herald, Ret Full buffed - the audit's P3).
  Section 5 (Heartpierce's empty socket) VOID by RULING 2026-10-10 (Fate): the lists use the
  NORMAL Heartpierce because the heroic version's effect does not work, and the normal has no
  socket. Game data agrees: 49982 (normal, driver 71880) has no socket; 50641 (heroic, driver
  71892) has one prismatic. The six proxy lines already model the normal proc (trigger 71882)
  with no gem; only the page linked the heroic id - six rows relinked 50641 -> 49982 with a
  version note (patch 342). No profile changes, no runs. The proxy's item level (46) is carried
  as it stood.
  Section 15 (Frozen Spellthread rank 1 on three lists - the audit's S6) MOVING 2026-10-10 on
  single-token inputs (legs 6539 -> 6541, the rank 46 caster lists already sim): Devastation
  Herald 2815 -> 2824 (+9, a clean same-day A/B; sheet +1 int +1 stam; page legs link 387291
  -> 387294; patch 343); Resto Herald 3788 -> 3799 (+11, same-day A/B on the repaired profile;
  sheet +1 int +1 stam; same link move; patch 344); Resto Obtainable 4244 -> 4257 (+13 on a
  09-30 base, in line with the two same-day gains, so no engine movement shows; sheet +1 int
  +1 stam; stamp -> 2026-10-10; same link move; patch 345). Section 15 CLOSED: every caster
  list sims rank 3 and no rank-1 link is left on the page.
  Section 3's two gem rows (the audit's S7) CLOSED 2026-10-10 by a same-day A/B at 100k: the
  stored Feral All-time profile verbatim 2770 (exact - the 09-09 number is current on today's
  engine), the page's Delicate Crimson Spinel on both rings 2765 (-5, far outside run noise:
  two B runs agree within 0.2 DPS). Relabel branch: both page ring rows now show the simmed
  Deadly Pyrestone x2, stamp -> 2026-10-10, no profile change (patch 346).
  Section 8 (professions - the audit's D2, sim item S8) LANDED 2026-10-11 on Fate's RULING of
  2026-10-10: where the scribe-only shoulder inscription is better, the lists use it. Five
  pilot sweeps (2026-10-10, profileset arms on stored lists) put Master's Axe above Greater Axe
  on Marksmanship (3595 vs 3588, Swiftsteel 3577), Frost DK (3266 vs 3260, Lionsmane last at
  3253) and Fury (4220 vs 4212, Lionsmane 4204), and Master's Storm above Greater Storm on
  Resto Obtainable (4270 vs 4257). The Pandaria Secret inscriptions topped every sweep but are
  crafted items that require level 32 - out. Engine note: SimC gives Lionsmane and Swiftsteel
  2 main stat at 30 (0.18 x 13.81 rounds down) where the bracket's tooltip table says 3; the
  pick holds either way (a 3 Str + 1 crit arm read 3263 vs 3266 on Frost DK, 4214 vs 4220 on
  Fury). Game data check, all 109 profiles: the shoulder inscription is the only item,
  enchant or gem that carries a profession requirement, so a scribe is all the lists assume
  (the four bind-on-pickup crafted chests stay the open half of D2).
  Method of record: one token per list (the shoulder enchant_id); a spec's self-buffed lists
  share one run - the first list is the actor, Obtainable and Herald are profileset arms made
  of their own gear lines (those tiers differ in gear only), and a control arm reruns the
  stored list; Full buffed lists run alone (their talents, buffs and action list differ).
  Arms proven equivalent on a local build (af05b9e, 12.1.0.69933) with a fixed seed: 52 of 52
  identical to the last digit. No sheets sent: stat panels come from that build, which
  reproduces 103 of the page's 109 sheets; its 20k-iteration cross-checks land within 2.2 DPS
  of the Raidbots number on 49 of the 51 lists (the two others are Windwalker lists, below).
  Patch 349, the ruling proper: 45 lists in 23 runs, 43 from Greater Axe (3808 -> 3835) and 2
  from Greater Storm (3810 -> 3838). Full buffed / All-time / Obtainable / Herald:
  Marksmanship 4528 / 3594 / 3457 / 3143; Survival 3909 / 2808 / 2692 / 2369; Beast Mastery
  2640 / 2143 / 2064 / 1878; Windwalker 4445 / 2909 / 2792 / 2705; Retribution 4316 / 3115 /
  2904; Assassination 4668 / 2779 / 2645 / 2305; Outlaw 4198 / 2480 / 2369 / 2140; Subtlety
  2668 / 1612 / 1509 / 1228; Enhancement 3730 / 2622 / 2521 / 2354; Feral 4073 / 2774 / 2644 /
  2340; Havoc 3263 / 2016 / 1940 / 1762; Resto Obtainable 4270, Herald 3809. Against the
  control arm the swap is worth +3 to +13; eleven of twelve controls read within 3 DPS of the
  stored number. The twelfth is Survival: 2803 on a list stored at 2780 (09-23); Obtainable
  (10-03) rose +27 beside Herald's +4 (10-10), and its stored file reads 2688 on the local
  build - about +23 of engine movement on the two oldest stamps, the audit's D5 in a measured
  case. The seven Vibroblade numbers keep their factors of record on new raws (Outlaw 3765 /
  2224 / 2125 / 1919, Windwalker Herald 2425, Havoc Herald 1668, Enhancement Herald 2219).
  Panels: +1 crit rating on 43 lists; Enhancement Full buffed's mastery-rating typo (100 for
  10) corrected with its panel. Carried, not re-measured: the Buff worth panels of the eleven
  Full buffed lists. Left as found: the stale header note in Ret Full buffed's profile.
  SimC notification banners on five runs are the lists' own 'Trivial' notices, reproduced on
  the local build and unrelated to the swap: Windwalker A and B (buff touch_of_death_ww
  initialised with max_stack 0), Feral Full buffed (its fallback weapon oil, Thalassian
  Phoenix Oil 8052, asks for item level 120 on a 47 weapon and is applied anyway - an input
  for the pending melee-stone ruling) and both Unholy runs (main-hand runeforge is not
  Apocalypse). FOUND on the way, OPEN: Windwalker numbers carry a run-to-run spread of about
  +-5 DPS that iterations do not remove. Touch of Death fires at the very end of the fight in
  13% to 42% of iterations depending on the run's seed; with the action removed four seeds
  agree within 1.2 DPS (2783-2784 against 2788-2795 on Obtainable, local build, 8k each).
  Patch 350, beyond the ruling: the six Death Knight lists on Lionsmane (4194 -> 3835), Frost
  and Unholy on Full buffed / All-time / Obtainable - their Herald lists already wore
  Master's Axe. Four runs. Frost 4875 / 3265 / 3055 (from 4855 / 3332 / 3048), Unholy 3664 /
  2545 / 2378 (from 3652 / 2511 / 2350). The swap is worth +13 against the control arm on both
  All-time lists. Frost All-time falls 67 all the same: the stored 3332 (09-23) no longer
  reproduces - the unchanged list read 3252 in the run and 3253 in the sweep. Obtainable
  (09-30) has not moved: its stored file reads 3048 on the local build. Unholy moved up: the
  control read 2532 on a list stored at 2511 (09-06), and the stored Obtainable (2350, 10-03)
  reads 2370 on the local build. Panels: strength -2 and crit +1 rating on all six; Frost
  All-time's stamina corrected 1163 -> 1039 with its panel (the 09-23 sheet no longer matches
  the list). Carried: the two Buff worth panels. S8 CLOSED: all 109 profiles wear a Master's
  inscription (60 Axe, 49 Storm). OPEN from it: why Frost All-time moved (D5), and the
  Windwalker Touch of Death spread above.
  D2 CLOSED 2026-10-11 (patch 351). Fate ruled, from two mock-ups, that the page states the
  professions a list assumes: a 'Professions assumed' line under the list description plus
  row tags. Scribe only sits on the 109 Master's shoulder inscriptions (spells 61117, 61120);
  Crafter only on the four bind-on-pickup Sunwell chests (34377 Blacksmithing, 34373
  Leatherworking, 34364 and 34365 Tailoring; 48 rows). Both are derived from the rows at
  render - SCRIBE_ENCH and BOP_CRAFT in the page code - so no row and no number moved. The
  text export carries them too. The six other crafted items on the lists bind on equip.
  D3 CLOSED 2026-10-11 (patch 352). Ruling: keep the Consumables panel on All-Time, Obtainable
  and Herald and print 'Not included in the DPS shown' under its title. All 82 profiles of
  those three lists disable potion, flask, food and weapon buff; only Full buffed sims them,
  and its tab carries no line. Rendered from the list id; no data moved.
  D4 CLOSED 2026-10-11 (patch 353). Ruling: the seven effective-DPS numbers (Outlaw on four
  lists, Herald of Windwalker, Havoc and Enhancement) wear an 'effective' tag beside the DPS
  badge, raw figure on tap or hover, and an 'eff' mark in the class list. Data: rawByList on
  the four specs names the raw sim result per effective list. validate.js holds it to the
  off-hand note ('raw N x ... = EFF') and to dpsByList, in both directions: a landing that
  moves one of the seven has to move all three. On Outlaw Full buffed the tag shows the
  PI-less raw (raw x shown / effective = 3553) beside the sim's 3765, and the note now says
  the badge is the number less Power Infusion (P15 closed).
  D6 CLOSED 2026-10-11 (patch 354). Ruling: the hidden Augmentation entry stays an unlisted
  preview and says so. Any entry with hidden:true now shows a 'Preview, number pending' tag
  beside its DPS badge, and the phone class dropdown lists it as '(preview)' while it is the
  one open. It is still out of the class list and out of bestOf. Giving Augmentation a real
  entry and a number of record remains its own open ruling.
  D5, display half CLOSED 2026-10-11 (patch 355). Ruling: the sim date goes beside every
  number. The spec header prints 'simmed 7 Oct 2026 - Raidbots' after the DPS badge, from the
  list's prov string; it was hover-only, so a phone never showed it.
  D5, re-run half RULED: only what moved. The screen: all 57 lists not stamped 10-11, run
  unchanged on the local build (af05b9e, 20k iterations on 40 lists, 10k on 17; calibration
  only). 53 reproduce within 1.7 DPS. Four do not: Arms All-time 2547 against 2703 (stamp
  09-11), Frost Mage Obtainable 3556 against 3506 (09-09), Devastation All-time 3290 against
  3281 and Obtainable 3147 against 3139 (both 09-09). OPEN: Fate's three runs (S9).
  WHY lists move, found with the screen: SimC's game data was retuned twice in the window.
  2026-09-22 (commit 3602eac, build 69933, 154 spell effects): Frozen Orb 0.676 -> 0.777 and
  Glacial Assault 1.5 -> 2.25, the Devastation aura 63 -> 71, Obliterate x1.10 with the Frost
  DK aura -2 -> -7, and the auras of Enhancement, Elemental, Shadow, Windwalker, Outlaw,
  Assassination and Subtlety. 2026-10-06 (commit 15d0069, 52 effects): Lava Lash x1.35 and
  the Enhancement auras, Outlaw, Subtlety, Devourer's spenders. Proof by override on today's
  build: with the pre-09-22 values restored the three caster lists return their stored
  numbers (3506, 3281, 3138 against 3139). The audit's two Enhancement jumps on identical
  profiles (+5.8% after a 09-15 stamp, +8.9% after 10-03) sit one on each wave.
  Arms All-time is another case. No warrior spell changed and the class module has no commit
  between 09-06 and 10-04; the profile as committed on 09-11 reads 2546 today. The 09-11
  landing says 2703 came from an export with deviations the committed profile corrected
  (target level, Dragonspine at 108 haste, Untamed Blade at 0.67), 'until a rerun of the
  canonical file; flagged, direction unknown'. It was never re-run. The direction is -157.
  Frost DK All-time (open since S8): with the pre-09-22 values restored the pre-S8 list
  reads 3138, its 09-03 number (3137); on today's data 3253, the S8 control. So 3137 -> 3253
  is the 09-22 wave. The 09-23 run's 3332 came with stamina 1163 against 1039 on an unchanged
  profile, and neither data state reproduces it: that run is the outlier, not today's number.
  Unholy All-time's +21 is not explained by the window (its stamp, 09-06, predates it).
  D7 RULED 2026-10-11: Touch of Death comes out of the four Windwalker action lists. Local
  estimate without it: 4438 / 2897 / 2784 / raw 2414 (from 4445 / 2909 / 2792 / raw 2425).
  OPEN: Fate's two runs (S10).
  S9 CLOSED 2026-10-11 (patch 356): Fate's three runs of the four lists, unchanged. Arms
  All-time 2546 (from 2703; local 2547), Frost Mage Obtainable 3555 (from 3506; local 3556),
  Devastation All-time 3291 (from 3281; local 3290) and Obtainable 3148 (from 3139; local
  3147, run as an arm of All-time). Profiles renamed only, panels unchanged, stamps 10-11.
  D5 CLOSED with it: 55 lists are stamped 10-11 and the other 53 were reproduced within 1.7
  DPS on the local build that day.
  S10 CLOSED, D7 CLOSED 2026-10-11 (patch 357): the two touch_of_death lines are out of the
  four Windwalker profiles; a comment marks the spot and a standing rule is added above.
  Fate's two runs: Full buffed 4438 (from 4445), All-time 2896 (2909), Obtainable 2783 (2792),
  Herald raw 2414 (2425) = 2693 effective (2705) at the factor of record. Each within 1.2 DPS
  of the local reading (4438 / 2897 / 2784 / 2414); in S8 two Windwalker lists were the
  only ones more than 2.2 from it. rawByList and the Herald off-hand note moved with the
  number. Carried: the Buff worth panel, and P = 0.973 (the local build's by-school share
  reads 0.978 with or without Touch of Death; applying it would be +1 effective DPS).
  The rulings pass is complete: D2 to D7 ruled and landed, patches 351 to 357.
  PAGE DATA PASS (the audit's P items) OPENED 2026-10-11 on Fate's call.
  P1 to P3 CLOSED (patch 358): seven enchant labels follow the sim. Devourer Herald's two
  rings read Accord of Haste (297989) - the relabel the 10-10 A/A called for, section 3's
  ninth and last input (4 landed, 5 relabelled). Gale-Force Striking (255141) shows on the
  Assassination and Subtlety Herald off hands. Crusader shows on the Arms Full buffed, Arms
  Herald and Ret Full buffed main hands, so all 16 warrior and paladin weapon rows carry it.
  No profile and no number moved. Page enchants against all 109 profiles: 1149 rows agree by
  spell, 9 Crusader rows sit on weapon lines with no enchant_id=1900 (ring-proc model), and
  the 101 Waking Stats rows have no spell id yet (P7).
  P4 and P5 CLOSED (patch 359): the Socket Proc badge sits on every row that shows one gem
  over its item's native sockets (waist excepted - the buckle). 89 rows gained it: 67 necks
  and rings on Obtainable and Herald, Survival's helm and bracers on its four lists, Eversong
  Cuffs on eight Herald lists, and the six TW-47 rings on Full buffed, three of which also
  gained '(Timewalking)' in the source. One came off: Resto Full buffed's three-gem neck.
  The rule holds on all 266 badged rows against the DBC socket counts. No number moved.
  P6 and P7 CLOSED (patch 360): 141 enchant links. Feet 'Greater Agility' linked the gloves
  spell 20012 on 40 rows and now links the boots spell 20023 (both apply enchant 1887, the
  one simmed). Chest 'Waking Stats' had no spell id on 101 rows and now links 389410. Link
  check of record: through the linked spell's Enchant Item effect, 1148 rows apply their
  profile line's enchant id; Waking Stats matches by name (enchant 6625 has no spell column
  in the DBC table); Icescale Leg Armor (60582) is not in SimC's spell data and was read on
  Wowhead. A linter enchant compare (T1) has to go through spell effects the same way: the
  DBC enchant table names one spell per enchant, 20012 for 1887.
  P8, the part with no ruling attached, CLOSED (patch 361). Panel: Unholy Obtainable and
  Herald gain the entries All-time has (they showed no panel); the weapon buff comes off an
  off hand that cannot take one on Arms x3 (one two-hander) and Devastation x4 (staff, or a
  held off-hand on Herald). Profiles, proven by fixed-seed A/B on the local build (whole
  output identical, 1000 iterations, one thread): Devastation Full buffed drops its off-hand
  oil token, and ten Full buffed profiles gain an explicit temporary_enchant=disabled (BM,
  MM, SV, Enh, Ret, Fury, Outlaw, Assa, Sub, WW) - SimC's default for them was already
  'disabled', so the standing rule now holds in writing on every profile but one.
  FOUND, OPEN (a sim): Feral Full buffed is that one. SimC's default there is
  main_hand:thalassian_phoenix_oil_2 - +7 crit and +7 haste rating from an oil the DBC
  restricts to item level 120+, on a level-47 staff. Local build, 20k iterations: 4073 as
  stored (the Raidbots number exactly), 3986 with temporary_enchant=disabled, -88. The panel
  carries the oil too (crit 111 and haste 150 would read 104 and 143). An earlier check that
  called the line a no-op on all eleven had appended it after the enemy block, where it
  never reached the player. Still OPEN by ruling: the melee stone on the Full buffed panels.
  P10 CLOSED, P11 in part (patch 362). Source labels on 23 rows: The Untamed Blade loses
  '(Anniversary)' on the four Arms rows (same item and level as the other eight; Obtainable
  bans Anniversary); Heartrazor x8 names High Astromancer Solarian, Arcanite Steam-Pistol x2
  Al'ar, Heartpierce x6 Lady Deathwhisper, Meteorite Crystal x3 Algalon the Observer (all
  four read on Wowhead). Heartrazor had two labels because validate.js matches the Herald
  era rule on source text: its Herald rows needed 'Tempest Keep' in the string (T5).
  Fury Obtainable's off-hand alternate 'Bonereaver's Edge -11.8%' is the dual-Bonereaver's
  pairing of the weapon sweep and carries variant 'second copy'.
  P9 NOT APPLIED: the nine Nibelung notes were written by Fate on 2026-08-07 (706ee73,
  reworded 532c8ba), five days after Nibelung came out of the builds - an explanation of
  the removal, not a leftover. They stand unless Fate rules otherwise.
  P11 still OPEN: 18 rows carry deltas against a base their list no longer has, Resto
  Obtainable's main hand has one alternate with no result, and 21 rows list alternates
  with no note. The first two need sweeps; the third needs Fate's words.
  P12 and P13 CLOSED (patch 363). Stat panels: Balance All-time mastery 21.19 (101) -> 21.95
  (106) - the panel predates the 09-16 neck swap to Mark of the Trained Soldier, whose
  landing called the sheet unmoved; Shadow All-time mastery rating 103 -> 110 at the same
  15.03%, which is what the profile gives at 110 (a transcription slip in the 10-03 landing).
  Sheets of record: all 109 panels now equal the local build's sheet of their stored
  profile (105 before this pass, +2 corrected here, +2 Affliction lists read with a
  snapshot_stats line added for the check). The entry-level dps field equals
  dpsByList.alltime on all 28 entries again (Elemental 2397, Shadow 4165; the stale-headline
  item of 2026-10-07 is closed). Eight rare gems gained q:3 (necks: Deadly Ruby x3, Quick
  Sapphire x2, Quick Emerald x2, Masterful Onyx x1); all 1598 gem entries now agree with the
  DBC on name and quality.
  P14 CLOSED (patch 364). The share image assets/og.png is redrawn in the same design
  (1200x630; hexagon mark, Cinzel 700 title at 58 px, Plex Mono lines at 25 and 20 px,
  rendered at 2x in Chromium and downscaled) with the tagline '27 specs, 13 classes', four
  lists and patch 12.1.0; the old file said 13 specs, three lists and 12.0.5. Its source is
  kept with the audit docs in the project (claude/share-image.svg). Meta and og description
  say '27 specs across all 13 classes' and four lists. The All-Time tab description loses
  'Generated from the 13 live sim profiles.' The first tab reads 'All-Time Full buffed'
  (label only; ids, slugs and folder names are untouched). CONFIG.notice no longer says
  'seven specs landed so far': it is a timeless line of the feed's footprint, so the feed
  replaces it with no layout shift (0 px at 1440, 1280, 1024, 768, 390 and 360). The Tooling
  section's sentence on CONFIG.notice now describes what the page does, and the spec-count
  places are listed under Expanding to all DPS specs.
  P17 CLOSED (patch 365), 24 profiles, none renamed, each proven identical to its previous
  version by fixed-seed A/B (local build, 1000 iterations, one thread, whole result block).
  Fire x4: cooldown.combuastion -> combustion on the unequipped Meteorite Crystal line. Ret
  Full buffed and its Dummy mode copy: header note 'Raidbots strips these' corrected (4316 on
  Raidbots, 4318 local). Seven stray name= lines out (Feral Obtainable and Herald, Frost DK,
  Affliction, Shadow and Fury Herald, Resto Full buffed); the actor line's name shows again.
  Affliction All-time and Obtainable write a stat sheet (snapshot_stats), and both sheets
  match their panels. Eleven one-gem neck and ring lines take the one-socket bonus id of
  their family (8782 -> 8780, 10879 -> 10878), so bonus-id sockets equal gems on every
  jewellery line that carries a socket bonus. Crusader: enchant_id=1900 is off the seven
  weapon lines that carried it (Fury Full buffed and All-time, Arms All-time, Obtainable,
  Herald); A/B in both directions, adding it to the nine lines without and removing it from
  the seven with, is identical on all twelve lists, and no Holy Strength buff exists in a
  report with the token. The ring is the whole model; the rule is written into Standing
  item decisions. Only list/Dummy mode/4343 - Warrior Fury.txt still carries the token.
  P16 OPEN (sims): Meteorite Crystal's proxy on Devourer Full buffed, All-time and
  Obtainable reads ilevel=41,stats=8int; the page, the Herald note and the page's other
  Algalon drops (79 rows, all 43) say 43, and at 43 SimC gives the item 9 Intellect (8 at
  41). So the line is not a label: it is 1 Intellect short. Heartpierce at 46 still wants
  a tooltip.
  S11 Feral CLOSED 2026-10-11 (patch 366). Fate ran Feral Full buffed with
  temporary_enchant=disabled, the one line added: 3986 on Raidbots, from 4073; the local
  build had read 3986 (and 4073 for the stored file). The 87 DPS were the druid module's
  fallback Thalassian Phoenix Oil. Panel: crit 32.27 (111) -> 30.86 (104), haste 31.31 (150)
  -> 29.99 (143), the oil's 7 rating each; the stamp was already 10-11. Shown number 3908 ->
  3821, place unchanged (16th), still the best druid spec on the tab. Carried: the Buff
  worth panel, whose legs were all measured with the oil in. Every one of the 109 profiles
  now carries an explicit temporary_enchant line; the standing rule above records the case.
  S11 Devourer CLOSED 2026-10-11 (patch 367), and with it the Meteorite half of P16. Fate
  ran both inputs: Full buffed 5670 (from 5656), All-time 3850 (3838), and Obtainable 3700
  (3689) as an arm of the All-time file, whose control arm (the old line) read 3838 again.
  Local build: 5671, 3849, 3700. One line per profile:
  trinket2=meteorite_crystal_macro_proxy,ilevel=43,stats=9int (was 41 and 8int). Panels:
  Intellect 359 -> 360, 295 -> 296, 284 -> 285, nothing else, and the local sheet of each
  stored file matches. Stamps 10-07 -> 10-11; Herald (2918, no Meteorite) keeps 10-07.
  Places unchanged, 4th on all three tabs; Full buffed shown 5377 -> 5391. The tooltip
  question (Q1) got no answer in words: Fate ran the inputs the checklist tied to it, and
  Wowhead reads the bare item at 41 / +8 Intellect and at 43 / +9 with bonus id 9043, which
  the 79 other Algalon rows carry at 43 in their profile lines. The use effect is 16
  Versatility a stack at both levels, so trinket1's use=700vers (380 + 320) stands. Carried:
  the Buff worth panel. Heartpierce at 46 is the open half of P16.
  D8 RULED and Q2 ANSWERED 2026-10-11 (patch 368), by Fate, from a mock-up of the note and
  three questions. D8: the Nibelung note stays as written, so P9 is CLOSED as a misreading.
  Q2: the normal Heartpierce reads 46 in game, which is the page's level, so P16 is CLOSED.
  Asked with them, because validate.js allowed one id at two levels and its comment said
  'pending re-runs' since 09-26: Abracadaver reads 45 in game. The 22 rows at 45 stand; the
  three Full buffed rows at 47 (Shadow 5757, Affliction 4675, Devastation 4456) are
  over-pinned. Local build at 45: 5706, 4635, 4416. The Icecrown scale that follows is in
  Standing item decisions. S12 OPEN, inputs issued the same day, each with a control arm
  holding the old line: S12a, the three Abracadaver lists (3 runs); S12b, Plague-Soaked
  Leather Leggings 47 -> 45 on the 24 lists that wear them (Feral, Balance, Devourer, Havoc,
  Outlaw, Assassination, Subtlety, Windwalker; 16 runs), which waits on that item's tooltip.
  Fixed seed: in all 19 files the actor and every arm equal the lists run alone. Until the
  runs return, page and profiles keep 47 on those 27 rows, beside the numbers simmed at 47.
  S12a CLOSED 2026-10-11 (patch 369). Fate ran the three inputs: Shadow Full buffed 5705
  (from 5757), Affliction 4635 (4675), Devastation 4417 (4456); the control arms read 5757,
  4676 and 4455. Local build: 5706, 4635, 4416. One line per profile, main_hand ilevel=47 ->
  45. Panels: Intellect 330 -> 328, 329 -> 327, 350 -> 348, and 1 crit rating less on each
  (20.25%, 31.67%, 30.07%); the local sheets of the stored files match. Rows 47 -> 45;
  stamps to 10-11 (from 10-07, 09-30, 09-30). Abracadaver is 45 on all 25 rows and 51887 is
  out of ILVL_SPLIT_OK. Shown: Shadow 5705, 2nd; Affliction 4445, 8th; Devastation 4289,
  down one to 12th, below Windwalker. Carried: the three Buff worth panels.
  S12b CLOSED 2026-10-11 (patch 370). Fate ran the 16 inputs. Full buffed / All-time /
  Obtainable: Feral 3957 / 2756 / 2627 (from 3986 / 2774 / 2644), Balance 3751 / 2807 / 2698
  (3775 / 2826 / 2715), Devourer 5635 / 3820 / 3673 (5670 / 3850 / 3700), Havoc 3242 / 2004
  / 1927 (3263 / 2016 / 1940), Outlaw 4168 / 2453 / 2351 effective on raw 3738 / 2200 / 2109
  (4198 / 2480 / 2369), Assassination 4634 / 2761 / 2623 (4668 / 2779 / 2645), Subtlety 2647
  / 1601 / 1496 (2668 / 1612 / 1509), Windwalker 4413 / 2878 / 2765 (4438 / 2896 / 2783).
  All 16 control arms within 1 DPS of stored; every number within 1 DPS of the local
  reading. One line per profile, legs ilevel=47 -> 45. Panels: 1 main stat, 1 crit and 1
  haste rating less on each, local sheets matching. Rows 47 -> 45; Balance's stamps to 10-11
  (from 09-30, 09-15, 10-03), the other 21 already there. Places: Full buffed Assassination
  10th, Outlaw 15th, Feral 17th (each down one); All-time Balance 15th (down one);
  Obtainable Assassination 18th (down two). The Balance A input ran twice, once under the B
  title (2807 / 2697 against 2807 / 2698); the run under its own title is the one landed,
  and the Full buffed run followed. Q4, the leggings' tooltip, got no answer in words: Fate
  ran the inputs the checklist tied to it, and Wowhead reads the item at 47 bare and 45
  under bonus id 9049. Icecrown's three 10-heroic items on the page (Abracadaver, Mag'hari
  Chieftain's Staff, the leggings) now all sit at 45. Carried: eight Buff worth panels.
  S12 is CLOSED: 27 lists, 19 runs.
  PAGE CODE pass opened 2026-10-11 (to-do section 4, 24 items, patches 371 on). Navigation
  (patch 371). C1: under "Best per class" the page now shows the class's best spec on the
  list shown, so a tab click moves Druid between Balance (All-time, Obtainable) and Feral
  (Full buffed, Herald); it used to keep Balance with nothing selected and a blank phone
  dropdown. C2: the view toggle is drawn from state on every render, so a deep link to a
  non-best spec shows "All specs" as on. C9: the class segment of a link also matches the
  class key (#deathknight/unholy/herald opened Frost, #demonhunter/havoc/herald Devourer),
  and a class named alone lands on its best spec for the list (#death-knight, #evoker and
  #mage/herald fell back to the default view). Checked in a browser on 27 addresses, the
  tab and toggle sequences, and all 109 links the page writes; no page data changed.
  Layout (patch 372). C3 was wider than the audit's six widths showed: swept at 36 widths,
  main scrolled sideways on all 109 views at 861 and 900 px, 91 at 960, 29 at 1009 (a 1024
  window with a 15 px scrollbar; read on the live site as all 27 Full buffed views), 12 at
  1024, 2 at 1100, and on phones 40 at 320, 29 at 360, 11 at 390. Causes: the two-column
  pane line squeezing the consumable lines (no-wrap, 44 px icons) and the Buff worth grid's
  five unshrinkable columns. Now: the pane line stacks below 1181 px (was 861), with the
  stat panel's labels kept beside the chart; the Buff worth note column shrinks and wraps,
  and at 520 px and below the note takes its own line (the tag goes below 350); a
  consumable line is one flex unit that breaks inside only as a last resort. L3: consumable
  icons take the gem treatment, 24 px and no stock frame. L6's empty stat panel at 1024 goes
  with the stacking. After: 0 views scroll sideways and nothing leaves its panel at 36
  widths from 320 to 2560 px, and at 20 desktop widths with a 15 px scrollbar. Text content
  of all 109 views unchanged at six widths. Instrument: the sandbox now emulates Wowhead's
  icon markup as read off the live site (span.iconmedium > ins + del), and reproduces the
  live page's overflow at 360, 390 and 1009 px: exactly on 26 of the 27 Full buffed views,
  Devourer 4 px off because Fate's browser (fr) writes 1 047 where the sandbox writes 1,047.
  View toggle (patch 373). C4: its rules used var(--line) and var(--fg), never defined, so
  the border declaration was void and the on-state colour fell back to the inherited one;
  the buttons took the browser's sans-serif. The five uses now name --edge and --parchment,
  and the toggle is an outlined two-way switch in the page font, the active half filled
  (10.5px in the 196 px rail, where the two labels need 172 of 176 px; 12px on a phone).
  Width, chart, talent string (patch 374). L5: main is capped at 1400 px; the gap between
  an item's name and its enchant at 2560 px goes from 890 to 396 px, and the layout is the
  same on every screen past 1600. L6: STAT_CAP is computed, the next multiple of 5 above
  the highest secondary in the data (76.54, so 80), instead of a constant 75 that
  Windwalker's Full buffed mastery had passed. M5: the talent string fades at its right
  edge, with padding so its last characters scroll clear of the fade.
  Access (patch 375). C6: the Buff worth "Consumables" head row holds a real button with
  aria-expanded; the row click stays. L7: tabs carry aria-selected, the class list
  aria-current, the view toggle aria-pressed, all written at render; a skip link is the
  first stop in the tab order and moves focus to main with a handler, not by following
  its href, because the hash is the view. Also: the rail's "eff" mark gets a space so the
  row's name reads "3,932 eff". 21 keyboard and accessibility-tree checks pass; pixels are
  identical before and after outside the eff marks, which move by 1.5 px.
  Loading and analytics (patch 376). O1: Wowhead's tooltips.js is deferred and the Google
  Fonts sheet loads as media=print, switched to all on load, so neither blocks parsing or
  the first paint; with either host hanging the old page had no body after 2.5 s, the new
  one has its 17 rows. Deferring was tried against the real script in Fate's browser:
  blocking, defer, defer with a refresh on load and async all iconize every link, the
  script scanning the page when it starts. C7: GoatCounter's own hit records the arrival
  as /BIS-List/; countView adds each view opened, and ran before count.js had loaded, so
  an arrival on a link was never counted under its view. A missed count is now retried on
  window load; an arrival on a link that names a view counts as that view, an arrival on
  the bare address does not. Tested with GoatCounter's count.js (GitHub master) on a
  non-local host name with the endpoint intercepted, 13 scenarios before and after.
  Dead code (patch 377). O3: removed filled(), the .fill rules, --sim and --theory, the
  hm:"ilvl" branch of the text export and its schema line (validate.js rejects the value),
  the commented-out Wowhead tags, a duplicate reduced-motion rule and a doubled
  grid-template-rows; the schema comment loses its "note" line (never rendered, on no
  row). Screenshots are pixel-identical before and after on nine view and width pairs.
  KEPT, flagged: the status field (1678 "sim", 6 "confirmed" on Fury's weapons; in the
  data shape of record, shown nowhere) and the class notes (10 specs have some; the
  renderer builds them and hides them "for now", and to-do H3 wants them). Both are data,
  and whether to drop them is Fate's call.
  Header notice (patch 378). C8, the download: the notice read all of CHANGELOG.txt on
  every load for one sentence: 216,496 bytes on the live site, 74,989 on the wire, against
  about 63,000 for the page itself. It now sends Range: bytes=0-4095 and parses
  the head; the full file is read on the first opening of the day's list. GitHub Pages
  answers 206 with the 4,096 bytes (checked on the live site); a server that ignores Range
  answers 200 and the page behaves as before; a head request that fails or does not parse
  falls back to the whole file. The head has its own address (&top=4k): asked under the
  full file's address, Fate's browser answered it from its stored gzip copy, 4,096
  compressed bytes. The toggle reads "all updates", no count, and carries aria-expanded.
  C8's other half, entries written for the project log, is editorial and already covered
  by the first-sentence rule in Tooling.
  Tablet table (patch 379). M3: the 860 px breakpoint did two jobs, folding the class list
  into a dropdown and stacking the gear rows. The rows now stack below 701 px, so 701 to
  860 px (upright tablets, narrow windows) keeps the four-column table with enchants and
  gem names; at 768 px a list is about 400 px shorter. Pixels at 700 px and below and at
  861 px and above are identical before and after. Four rules for a horizontal class strip
  that nav{display:none} had made unreachable went with it.
  ROUND ONE of the pass (patches 371 to 379, 16 of the 24 items) was then checked where the
  sandbox cannot go: the patched page, byte for byte the tree's index.html (SHA-256
  compared), loaded in Fate's browser on the live origin under the real Wowhead script,
  Google Fonts and GitHub Pages. 109 views at 8 widths from 360 to 1181 px: no sideways
  scroll, nothing outside its panel, every item and consumable icon in place, no script
  error; the notice's head request answered 206 with 4,096 bytes. Left for rulings: C5,
  M1, M2, M4, L1, L2, L4, O2.
  ROUND TWO (patches 380 to 384) builds the eight items left, as Fate ruled them the same
  day from seven questions, each shown as the real page with every option built.
  Phone rows (patch 380). M1, M2, ruling: show the enchant and name the gems (option C of
  three). Below 701 px a row reads slot, item, level and source, enchant (with its own
  "Enchant" label, there being no column head), gems by name, note, alternates; CSS order
  only, the markup is the table's. Empty enchant and gem cells take no room. A gem's icons
  and name stay on one line, the name wrapping beside them on a 320 px screen. All 1,259
  enchants, 1,598 gem names and 109 Scribe only tags show at 320, 390 and 700 px; a list
  grows 275 to 331 px at 390 px (median 2,059 to 2,337). Pixels at 701 px and up are
  unchanged.
  Off Hand row (patch 381). C5, ruling: no row (over a row saying the main hand takes both
  hands). The page padded every list to the 16 standard slots, and the only slot a list
  may lack is Off Hand: 60 of the 109 lists (59 published and the preview) wear a
  two-handed or ranged weapon and showed "Off Hand" with a dash, exported as "- TBD: Off
  Hand". A list now shows the rows it has: 1,684 rendered rows for 1,684 data rows, 60
  lists of 15 and 49 of 16. The 49 lists with an off hand render and export as before. A
  data row with no item still renders a dash and exports as TBD; no row is like that.
  Key (patch 382). M4, ruling: a key under the list (over badges that open on a tap). One
  table, BADGE, holds each badge's class, label and meaning; the badge's tooltip and its
  key line are the same words. The key is read off the rows just drawn (a data-badge
  attribute), so it names exactly the badges the list shows: 607 badges on the 109 lists,
  five different keys, never empty since every list has a scribe's inscription. Under Buff
  worth a line explains the tags the panel shows (27 panels, "measured" and "total"); the
  tag tooltips moved, unchanged, into a table, BW_TAG. Two tooltips were reworded to match
  their key line (HM only: a colon for the dash; Scribe only: without its own name). The
  key takes 29 to 53 px under a list on a desktop and 84 to 163 px at 390 px. The unused
  footer legend rule is gone. Still hover-only: the sweep base on 33 alternates.
  Back button (patch 383). O2, ruling: Back steps through views (the view switch and the
  order stay out of the link). writeHash() used replaceState on every render. A render the
  visitor asked for (class, class dropdown, tab, view switch) now calls pushState when it
  changes the address; the first render and a render that answers Back, Forward or a typed
  address still rewrite in place. pushState fires no hashchange, so nothing renders twice.
  31 assertions through the page's own controls and the browser's Back and Forward, on a
  desktop and a phone: one entry and one render per view opened, none for the order or for
  a switch that keeps the spec, Back to a non-best spec opens All specs, a reload in the
  middle, the preview entry, scroll position restored. A refused call (Safari allows 100
  in 30 seconds) leaves the view drawn. A view reached by Back or Forward is counted like
  a clicked one; the 13 analytics scenarios of patch 376 send the same hits as before.
  Grey text, ring, class colours (patch 384). L1, ruling: lift the grey, leave the sizes
  (over lifting both, or neither). --dim goes from #5c6575 (2.9 to 3.3 to 1) to #7b8597
  (4.5 on the lightest row background, 5.2 on the page); --tbd, a second grey used in
  three places, took the same value and folds into it. Only text colour changes, on about
  15,000 elements across the 109 views: no size, box or background. On Fury All-Time,
  measured on the live origin, the text under 4.5 to 1 falls from 56% to 20% at 1280 px
  and from 64% to 22% at 390 px; 54% is still under 12 px, by the ruling. What is left is
  item and gem names: epic purple (#a335ee, 3.5 to 3.6) and rare blue. FOUND HERE: on the
  live site the rare blue is not the page's. Wowhead's universal.css sets .q3 to #0070DD
  with !important (3.5 to 3.7 to 1) over the page's #2f8dff (5.4), on 608 item rows and
  275 gems; .q1 likewise (#fff over #eaeaea, on no row today). The sandbox loads no such
  stylesheet, so every mock-up of this pass showed the page's blue and the sandbox census
  read 47% to 9% for the same change. Put to Fate.
  L4, ruling: no ring. The audit said the ring never painted. Nearly: the clip-path that
  rounds an icon clips its box-shadow, but wherever an icon sat on a fraction of a pixel a
  one-pixel sliver in the quality colour showed along an edge (38 of the 42 item and gem
  icons on Frost Mage Herald, at every pixel density tried). The declarations, their hover
  variants and --qc on item links are deleted, and the sliver with them; so are the
  "a > ins" selectors, which match nothing under Wowhead's script (live page: 0 matches
  over 109 views, every icon a span.iconmedium).
  L2, ruling: class colours stay the official ones, small text included (Death Knight 3.0
  to 1, Demon Hunter 3.2, Shaman 3.7); a comment at .dpsbadge says so.
  ROUND TWO was then checked like round one: the patched page, byte for byte this tree's
  index.html (SHA-256 compared), in Fate's browser on the live origin under the real
  Wowhead script. 109 views at ten widths from 320 to 1920 px: no sideways scroll, nothing
  outside its box, 1,684 rows for 1,684 data rows, every item, gem and consumable icon in
  place, the key right on every list, all 1,259 enchants on the phone rows, no script
  error. The address call is refused inside that test frame, which exercised the try/catch
  of patch 383. The audit's 24 page-code items are worked through: 23 are closed, and O3
  is closed except for the two things patch 377 kept until Fate says otherwise, the status
  field (1,678 "sim", 6 "confirmed", shown nowhere) and the hidden class notes.
  THREE ANSWERS from Fate the same evening closed what the pass had left (patches 385 and
  386). D10, the status field: delete it. D11, the class notes: keep them hidden, for the
  stat priorities of to-do H3. D9, the blue of rare names: the page's lighter one.
  Status field (patch 385). Gone from all 1,684 rows (1,678 "sim", 6 "confirmed"), with
  its line in the schema comment and its one reader: the text export asked whether a row
  was "tbd". The 295 statuses on Buff worth rows are another field and stay. With the
  field dropped from the old dataset the two are identical in a deep comparison, key order
  included; the markup and the text export of all 109 views are identical; the page is
  28.8 KB smaller, about 1 KB of it on the wire. diffdata.js still names the field, so it
  can diff across this commit. With D10 and D11, O3 is closed, and with it all 24
  page-code items of the audit.
  Rare blue (patch 386). D9, ruling: the page's lighter blue (#2f8dff) over the game's
  (#0070DD), from a mock-up of both. The collision is removed at its root: the page's
  links carried the classes q1 to q5 for their own colours, and Wowhead's universal.css
  colours .q0 to .q6 with !important. The classes are now quality-1 to quality-5, which
  that sheet does not know. Rare names stay #2f8dff (5.1 to 5.4 to 1) on 608 item rows,
  275 gems and 10 alternates; alternates with a quality on record are coloured by the
  page's own rules, in the colours Wowhead gave them. Checked on the live origin, the
  final page byte for byte (SHA-256 compared) under the real script and style sheet: over
  the 109 views no link is left in #0070DD and no element carries a q class; switching
  Wowhead's sheet off and on changes the colour of no link, where it changed 1,008 on the
  page before (954 rare names and gem icons, 54 alternates), so nothing changes colour
  after loading; on Fury All-Time the text under 4.5 to 1 is 10% at 1280 px and 11% at
  390 px, from 20% and 22%, all of it epic purple; and the sweep of 109 views at seven
  widths from 320 to 1920 px is clean. Two things to know when measuring in Fate's hidden
  browser pane: CSS transitions and animations do not advance there, so a colour read
  after a change is the old one unless transitions are switched off first; and the
  sandbox stand-in for Wowhead's script now carries these colour rules, so a sandbox
  render shows the site's colours.
  TOOLING pass opened 2026-10-11 (to-do section 5, T1 to T9, patches 387 on).
  Four folders, one line (patch 387). T3: CI lints list/All-time Full buffed with the
  other three, 109 profiles in one run. T8: a Full buffed profile must carry a
  temporary_enchant= line with a value, the buff or "disabled"; the linter only asked the
  other three lists for "disabled", so a Full buffed profile with no line passed and the
  class module could add its own. Run against history: on the tree before patch 366 the
  rule fails exactly Feral Full buffed (the 87 DPS of S11), and before patch 361 it
  fails that one and the ten profiles patch 361 gave a line. Today: 0 errors.
  Game data on file (patch 388). T2, page side. gamedata.json is cut from SimC's client
  tables (item_data, sc_spell_data, spell_item_enchantment, item_bonus; af05b9e, build
  69933) by gamedata.js for the ids the page and the 109 list profiles name: 200 items
  and gems, 42 enchants, 40 enchant spells, and the 292 bonus ids that add sockets. It
  rebuilds from a local SimC tree or from GitHub (--fetch, 6 s here, byte-identical), and
  refuses to write if a set of known facts no longer reads right, so a column shift in
  the tables cannot pass silently. validate.js fails a row whose id the file lacks.
  New row checks: name and quality against the id (alternates and gems too); the item's
  inventory type against its slot; class mask; weapon type and armour type against a
  table of what each class can equip (CLASS_RULES); an Off Hand row exactly when the
  main hand is one-handed, Fury aside; gems against sockets, with the Socket Proc badge
  on exactly the helm, bracer, neck and ring rows one gem over, the buckle on the belt,
  and two or three bonus-id sockets on All-Time and Full buffed jewellery only; an
  enchant label always with a spell id, the spell named as the row says and meant for
  that kind of item (the spell's own inventory mask); and the two tables behind the
  Professions line held by the data: SCRIBE_ENCH is exactly the linked spells whose
  enchant needs a profession (Runeforging, a class skill, is held to death knights
  instead), BOP_CRAFT exactly the crafted rows that bind on pickup, by profession.
  Found on today's page: one alternate with no quality (Talisman of Ephemeral Power,
  Devourer Obtainable trinket 1; q:4 added, the only page edit). Run on the audited
  tree 9de5159 with the file rebuilt for it, the same code reports the audit's findings
  to the row: 14 rows on 9 lists the class cannot equip (section 1), the 16 gemmed
  cloaks (2), 89 rows without their badge (4, the count patch 359 added), 6 empty
  Heartpierce sockets (5), 41 feet rows linking the gloves spell and 101 chest rows
  with no spell id (7), 3 Fire rows labelled Major Spellpower and linked to Major
  Healing, 8 rare gems drawn epic (15). Its limit showed there too: the two Greater
  Inscription spells that tree linked are not in SimC's spell data, and such a spell
  needs a hand-read line in MANUAL_SPELLS, as Icescale Leg Armor (60582) has today.
  Page rules (patch 389). T5 and T9, all in validate.js; today's page passes each one.
  T5. Herald's era rule reads the item id, not the source text: outside necks, rings and
  trinkets an id above 51999 fails unless ERA_ID_OK lists it with a reason (empty today;
  the highest such id on Herald is 50206). Ids run in order of creation and Icecrown ends
  just under 52000; of the 24,216 equippable ids below it in the game data all but two
  stray entries are wearable at 30. The old test matched 66 substrings, among them
  "Halls of", "Nexus", "Crafted", "World", "Quest" and "Vendor", which later expansions
  satisfy too, and it was why Heartrazor carried two labels. Every entry without
  hidden:true must carry all four lists (the rule covered primaries on three lists and
  left Full buffed optional), and a list with rows must have its dpsByList number. The
  entry-level dps field must equal dpsByList.alltime. The spec and class counts in the
  meta description and og:description must equal the entries listed (27 and 13).
  T9. An Icecrown drop must sit on the level of its difficulty: 10-heroic 45, 25-normal
  46, 25-heroic 47, from the icc tag gamedata.json gives the 11 such items the page and
  profiles name (heroic flag and id block; a normal by its heroic twin's name). A
  10-normal drop only warns: no level is on record for those. ILVL_SPLIT_OK is data now,
  not a comment: each entry names its levels, the lists a level is confined to (47 on
  Full buffed only, for both rings) and its ruling; the validator prints every entry on
  every run, and fails one the page no longer needs, one whose page rows show another
  level or list, and one whose reason says pending, re-run, until or to do.
  Run against history: on aaa8e7f, the tree before S12, exactly the 3 Abracadaver rows
  and the 24 of the leggings fail the scale; on the audited tree 9de5159 the two stale
  dps fields (Elemental, Shadow) and both descriptions ("13 specs") fail. Mutation
  tests on today's page, one defect at a time, for patches 388 and 389 together: 27 of
  27 caught with the message expected.
  Line against row (patch 390). T1, T4 and the profile side of T2, in lint_profiles.js,
  which reads gamedata.json too. Every gear line is first matched to its page row: by
  slot; for rings and trinkets by item id, then, for a proxy, by the row whose name the
  proxy's name starts with (dragonspine_trophy_proxy, meteorite_crystal_macro_proxy),
  then the one line and one row left over (pendant_and_meteorite_macro_proxy). Compared
  on every matched line: item level, so proxy rings and trinkets too (T4; a proxy weapon
  already was); gems as multisets, on rings and trinkets too and also when one side has
  none (the old test ran only when both sides had gems); and the enchant (T1). An
  enchant agrees when the spell the page links applies the line's enchant_id: through
  the spell because gloves and boots both give 1887 and the enchant table names one
  spell for it, so a table lookup would fail the 40 boots rows. A head line's
  enchant=<stat> proxy is not an enchant and is not compared. Crusader has its rule: a
  weapon row that shows it takes no enchant_id on its line, and the profile carries the
  ring proc (37str_15dur) on as many rings as weapon rows show it. Profile side of T2:
  every item, gem and enchant id on a line is in the game data, a gem_id is a gem, and a
  line's own sockets plus its bonus-id sockets equal its gems.
  Today: 0 errors on 109 profiles, 1,259 enchanted rows among them. Run on the audited
  tree 9de5159 it reports section 3 row for row: 15 rows with another enchant than the
  page shows (the sixteenth, Fire's label, is validate.js's), the 5 lists whose sim has
  an enchant the page lacks, Fury Obtainable and Herald with Crusader on the page and no
  ring, Feral's two ring rows, and Meteorite Crystal at 41 against 43 on three lists;
  plus what patch 365 tidied, enchant_id=1900 on seven weapon lines and ten jewellery
  lines whose bonus ids named more sockets than gems. Mutation tests on today's
  profiles, one defect at a time: 16 of 16 caught with the message expected.
  RULINGS of the evening (2026-10-11): ten questions put to Fate on three sheets, each
  with the local numbers or a mock-up, all ten answered. They follow, patches 391 on.
  Stone on the panel (patch 391). P8, ruling: list it, and correct the rogues (over also
  listing a stone on the other tabs of Survival, Enhancement and Havoc, or leaving the
  panels). The 13 melee Full buffed lists bake a stone into weapon damage and their Buff
  worth totals already include it on every one (each Consumables total equals its four
  parts), so the half of server58's stone report about folding it into the cell was
  already done; the panel alone left it out. Which stone follows from the weapon's type:
  Sharpening Stone on edges, Weightstone on blunt weapons. That rule reproduces every
  weapon line the other tabs showed, except six: Assassination and Subtlety listed a
  Weightstone for a dagger main hand on All-Time, Obtainable and Herald. 19 panels
  change: 13 gain a weapon line, 6 are corrected. Survival, Enhancement and Havoc kept
  one consumable set for every list; it is now written per list so Full buffed can carry
  the stone, and their other tabs still show none. Retribution's other tabs keep Hissing
  Rune. Copy SimC gives the stone as a temporary_enchant line, which SimC accepts and
  models itself; the profiles of record bake it instead and say disabled. validate.js
  holds three rules: a melee Full buffed list (Strength or Agility, main hand not a
  bow, gun or crossbow) names a weapon buff; a stone fits the weapon it is listed for;
  no buff is listed for a hand that holds no weapon. On the page before this patch the
  rules fail exactly these 19 panels; on the tree before patch 361 they also fail the
  seven off-hand buffs that patch removed (Arms x3, Devastation x4). Rendered: the
  Consumables text differs on 19 of 109 views and nothing else on any; no sideways
  scroll and nothing outside its box at 26 widths from 320 to 2560 px.
  Umbrage Armbands (patch 392). Found while writing the Icecrown check, which stops
  short of the Ruby Sanctum; ruling: the druid rows take the heroic like the rest (over
  keeping the normal and showing it at 46, or leaving normal at 47). Feral and Balance
  linked the NORMAL 53126 at 47 on Full buffed, All-Time and Obtainable; the 18 other
  rows that wear the item (Devourer, Havoc, the three rogues, Windwalker) link the
  heroic 54580 at 47. Wowhead shows this item on the same four steps as Icecrown, 44 to
  47 under bonus ids 9048 to 9051, so 47 is the heroic's step and a 25-player normal
  sits at 46. Six page rows and six profile lines now name 54580; nothing else differs
  (diffdata.js: six wowhead leaves). No sim was needed: bonus id 9051 on the line sets
  the level whichever id carries it. Fixed seed, on each of the six lists, the stored
  line, the heroic id at 47 and the normal at 46 give the same DPS to the last digit
  and the same stat sheet. 53126 leaves gamedata.json (199 items). validate.js gains
  the rule behind the finding: one item name at one item level has one id, since two
  versions of a drop differ in level; TWIN_OK is the exception list for a real pair
  (empty). On the audited tree, on the tree before S12 and on patch 391's it reports
  this one pair and nothing else. list/Dummy mode/2493 - Druid Feral.txt still names
  53126: it is an old reconciliation copy, eight other gear lines away from the list,
  and was left alone.
  Ledger (patch 393): the eight other rulings. Local-build numbers are the instrument's;
  the numbers of record come with Fate's runs. Proc rates, question 1 (T6): four weapon
  procs carried another spec's encoding and were never solved. The Untamed Blade on Arms
  is written 3.7ppm: Fury's 3.7 is a percentage per attack, Arms' export said 0.67ppm, and
  intake on 09-11 corrected the number and kept the unit. On a 3.6 weapon that is 22.2%
  per event and realizes 15.1/min against the 12.4 anchor. Eskhandar's Right Claw on Havoc
  and on Enhancement carries Windwalker's 0.88ppm and realizes 3.5 and 5.5/min against
  2.47. Bonereaver's Edge on Unholy carries Frost's 8.6% and realizes 4.5/min against
  11.0. Ruling: solve all four (over solving the three that overshoot, or leaving them as
  carried). Solved on the All-time lists, local build: Arms 18.2% per attack (12.4/min,
  2545 -> 2509), Havoc 0.63ppm (2.46, 2004 -> 1970), Enhancement 0.41ppm (2.48, 2620 ->
  2502), Unholy 20.9% (11.0, 2544 -> 2792). Inputs issued as S13, eight runs. None of the
  four has a log of its own; Unholy's anchor is Frost's, as Retribution's is the
  warrior's. The specs that were solved sit on their anchors: Retribution Untamed 12.3,
  Frost Bonereaver 10.9, Windwalker Eskhandar 2.46, Outlaw 2.53, Fury Bonereaver 27.4
  (27.6). Fury's Jackhammer does not: see its bullet above. The linter's 12 warnings
  stand until S13 lands; its registry is keyed by class and has to be keyed by spec then.
  Questions 2, 3, 4, 6 and 9 (Feral's enchant, Demonology's two lines, Hammer of Wrath,
  the stone bake, the meta gems) are recorded in their own bullets of this section, with
  the local numbers. Question 8: a note on a row with alternates is optional, and
  validate.js no longer warns without one (21 warnings gone); the bands and the deltas
  the page prints say what a note would. Question 10: todo.txt held one line, to verify
  the Obtainable lists of DK and Paladin; it is done and the file is deleted. Runs
  issued: S13 (8), S14 (1), S15 (2), S16 (2), S18 (2), fifteen in all. S17 was the stone
  bake and was not approved. Closed on the record the same evening: Outlaw All-time is
  effective; the evoker drift question (answered by the 10-11 screen and S9, patch 356);
  DK Roccor against Chaos; the stale dps fields. Still open, and Fate's: the paladin log,
  the health-timeline standard, Augmentation, the sweep bases of P11's alternates (18
  rows on an old base, ten with none, one alternate with no result), and the Jackhammer's
  anchor.
  Staleness screen (patch 394), T7. stale.js runs each of the 109 list profiles unchanged
  on a local SimulationCraft build and compares the result with the number on file: the
  file name's, or rawByList's on the seven effective lists. A profile is listed when it
  differs by more than 5 DPS and by more than three standard errors of the run, so a
  short run's noise is not read as a move. Results are written as they arrive and a
  second run resumes from them: the first full run survived a container restart.
  Reading of 2026-10-11, build 12.1.0.69933 (simc af05b9e), 10,000 iterations, 55
  minutes of sim time on two cores: all 108 listed profiles within 2.5 DPS of their
  number (75 within 1, 104 within 2); the largest is Frost DK Full buffed, 4877.5 against
  4875. Nothing is stale. The 109th profile is the unlisted Augmentation preview, which
  reads 1612 alone against the 2304 in its name: that number comes from a group sim, so
  the script reports a hidden entry and does not hold it to its number. Not screened:
  list/Dummy mode. T6 stays open until S13 lands; T1 to T5 and T7 to T9 are closed.
  S13 CLOSED 2026-10-11 (patch 395), run by Fate the same evening: eight runs, 16 lists.
  One token per list. Full buffed / All-time / Obtainable / Herald: Arms 3671 / 2509 / 2416
  / 2221 (from 3709 / 2546 / 2454 / 2255), The Untamed Blade 3.7ppm -> 18.2% per attack;
  Havoc 3176 / 1968 / 1894 / 1683 (3242 / 2004 / 1927 / 1762), Eskhandar 0.88ppm ->
  0.63ppm; Enhancement 3554 / 2502 / 2408 / 2245 (3730 / 2622 / 2521 / 2354), Eskhandar
  0.88ppm -> 0.41ppm; Unholy 4018 / 2792 / 2619 / 2414 (3664 / 2545 / 2378 / 2185),
  Bonereaver 8.6% -> 20.9% per attack. All eight control arms within 1 DPS of stored; every
  number within 5 of the local reading (Arms Full buffed 3671 against 3667, the rest within
  2). The two effective Herald lists: Havoc raw 1668 -> 1640, Enhancement raw 2219 -> 2121,
  both on refreshed shares (D25, in the Vibroblade bullet below); at the old shares they
  would read 1732 and 2250. No stat panel changes: each stored sheet equals its panel, and
  the new files give the same sheets. Stamps to 10-11 on Arms Full buffed, Obtainable and
  Herald and on Unholy Herald; the other twelve were there. Each profile carries a dated
  comment at the changed line; a fixed-seed run of the file as Fate ran it and as stored is
  identical on all 16. Places: Unholy 16th on Full buffed and All-time (from 21st), 19th
  on Obtainable (21st), 14th on Herald (21st); Enhancement 22nd, 21st, 21st and 19th (from
  19th, 19th, 19th, 15th); Havoc 25th on Full buffed (24th); Arms 21st on Herald (19th).
  Carried: the four Buff worth panels, priced on builds that Unholy's now sits 10% above
  and Enhancement's 5% below. Banners on four runs are the lists' own notices: the warrior
  module's fury_mid2_4pc_crit buff on Arms, the runeforge notice on Unholy. T6 CLOSED with
  it: lint_profiles.js keys its calibration registry by spec (the page entry's id), gives
  Arms, Unholy, Havoc and Enhancement their own entries, fails a spec with no entry and
  names a unit mismatch. Its 12 warnings are gone: 0 errors and 0 warnings on 109 profiles.
  On the tree before this patch the new registry fails exactly the 16 lines S13 changed;
  four mutation tests join the linter's suite, 20 of 20 caught. The Jackhammer's anchor
  closed the same evening (D24): 2.5% is the calibration.
  S14 CLOSED 2026-10-11 (patch 396), D13. Feral Full buffed 3957 -> 4028 (local 4028), the
  control arm 3957. One line: the staff's enchant_id 1896 -> 4227 and its baked damage
  39-47 -> 37-45, the stone alone, as on Survival's same staff. Page: the Main Hand row
  reads Mighty Agility (spell 95471, the link its three other lists carry); Agility 277 ->
  291 on the panel, the local sheet's value; nothing else on the sheet moves. The tab shows
  3863 (4028 less PI's 165) and Feral rises to 17th, past Survival's 3799. The stamp was
  already 10-11. A dated comment sits at the line; the file as run and as stored are
  identical under a fixed seed. Carried: the Buff worth panel.
  S15 CLOSED 2026-10-11 (patch 397), D14. Demonology Full buffed / All-time / Obtainable /
  Herald 3690 / 2763 / 2650 / 2274 (from 3659 / 2751 / 2638 / 2262); both control arms,
  which restate the stored default action list, read 2751 and 3659 exactly; every number
  within 1 of the local reading. Two lines per profile gain |!talent.summon_demonic_tyrant.
  The three benchmark lists disable consumables, so their +12 is Berserking (the actor is
  a troll); Full buffed's +31 adds the Volcanic Potion. No stat panel changes. Stamps to
  10-11 from 09-11, 09-30, 10-03 and 10-10. Places: 17th on All-time (from 19th), 20th on
  Full buffed (21st, shown 3584). A dated comment sits above the two lines; fixed-seed
  identical on all four. Carried: the Buff worth panel.
  S16 CLOSED 2026-10-11 (patch 398), D15. Retribution Full buffed / All-time / Obtainable /
  Herald 4303 / 3106 / 2895 / 2702 (from 4316 / 3115 / 2904 / 2711); every number within 1
  of the local reading. Two override lines per profile, 2.91414 -> 2.81 on effects 14488
  and 1291900. No control arm: the override is sim-wide; the base is the stored numbers,
  which the screen of the same day reproduced within 1.1. The header note that proposed the
  retune now records it. No place and no stat panel changes; Herald's stamp to 10-11, the
  other three were there. Fixed-seed identical, as run and as stored, on all four.
  Carried: the Buff worth panel.
  S18 CLOSED 2026-10-11 (patch 399), D20 and D22. Devourer Herald 2918 -> 2943 (local
  2944), control 2918: the helm's meta gem 76885 -> 25893; panel Intellect 255 -> 253;
  stamp from 10-07. Elemental Herald 1941 -> 2025, control 1940. Its input carried the
  ruled change as the actor (1954) and two question arms found while writing it: with the
  Desolation 2-piece proxy on the head, enchant=13crit as on Elemental's other three lists
  (2009), and with that and Elemental's own gems on nine pieces, the gems Obtainable wears
  slot for slot (2025). Fate ruled the last arm lands (over the proxy alone, or the meta gem
  alone). The stored profile's gear lines are that arm's lines; the list was the
  Restoration Herald shell of the 1891 landing, whose four enchants the audit had already
  retired. Page: nine rows change gems (Head, Shoulders, Back, Chest, Wrist, Hands, Waist,
  Legs, Feet), each now equal to its profile line and to the Obtainable row's gems; the
  head token is not shown, like every other. Panel: Intellect 259 -> 239, crit 22.45% (87)
  -> 30.27% (126), mastery 45.81% (57) -> 51.46% (72), the local sheet. Stamp from 10-10.
  Places: Elemental 23rd on Herald (from 24th, past Arcane's 1967); Devourer unmoved. All
  four Elemental lists and the three other Devourer lists were already on these meta
  gems. D23, same answers: Restoration's four lists get the proxy too; S19 issued, two
  runs, 12crit with a 13crit arm.
  D26, 2026-10-11: Herald gems. Surveyed on the local build at 10,000 iterations: each of
  the 27 Herald lists against itself with its spec's Obtainable gems, slot for slot. Five
  already wear them (Frost DK, Unholy, Balance, Windwalker, Elemental). Gains: Fire +75
  (the meta gem alone +11), Assassination +39, Subtlety +30, Fury +27, Demonology +16, Arms
  +12, Survival +9, Destruction +8, Enhancement +8, Beast Mastery +7, Havoc +7, Restoration
  +6, Marksmanship +4. Lower: Devourer -88, Feral -28, Outlaw -15, Frost Mage -12,
  Retribution -10, Shadow -10. Flat: Devastation +1, Arcane -1, Affliction -3. Enhancement,
  Havoc and Outlaw are raw, before the Vibroblade factor. RULED: the top four get a run of
  record, the regem as an arm beside the stored list; a list whose arm wins lands on it.
  Inputs issued as S20, four runs (Fire's carries the meta gem alone as a second arm). The
  nine smaller gains are a lead, not queued. Read the other way the same evening, the
  Obtainable list with its Herald list's gems, for the nine specs that read lower or flat:
  Feral +36, Outlaw +7, Retribution +7, Devastation 0, Frost Mage -2, Arcane -6, Affliction
  -19, Devourer -22, Shadow -31. Feral's is mostly one socket, +24: its Obtainable helm
  wears no Blasphemite, alone among the 104 profiles outside the evokers (who wear Elusive,
  which reads the same as Culminating on Devastation's four lists). A lead, not ruled:
  input issued as S22, one run, the list as stored with two arms.
  D27, 2026-10-11: the Desolation token is 12crit for every spec. Elemental's 13crit dates
  from its first landing (3abcfa8, 09-12); RULED a slip. Inputs issued as S21, two runs
  with control arms (local: All-time 2396 -> 2392, Obtainable 2296, Herald 2021, Full
  buffed 3244 -> 3239). S19 lands on its 12crit numbers; its 13crit arm is moot. FLAGGED
  to Fate the same day, after the ruling: Wowhead's tooltip for the bonus (spell 37609)
  reads 13 at level 30. It scales by player level to a cap of 27: 5 at level 10, 12 at 20
  to 24, 13 from 25. The in-game tooltip decides; if it reads 13, S21 is void, D27
  reverses and the 21 other profiles that carry the token are one crit rating short.
  F3 ANSWERED 2026-10-12: the Helm's 2-piece reads 12 in game at level 30 (Fate, asked with
  the S22 ruling after he had run S19 and S21 as sent). D27 stands; Wowhead's 13 is not the
  bracket's number.
  S19 CLOSED 2026-10-12 (patch 401), D23. Restoration Full buffed / All-time / Obtainable /
  Herald 6038 / 4492 / 4339 / 3871 (from 5944 / 4420 / 4270 / 3809); local 6036 / 4489 /
  4338 / 3872. Controls 5943 and 4418, both on stamps of 09-30. The 13crit arms read 6046
  and 4495 and are not taken. One token on each head line, enchant=12crit, and a dated
  comment; fixed-seed identical with and without the comment on all four. Panels: crit
  21.25% (81) -> 23.66% (93) on three lists, 16.03% (55) -> 18.44% (67) on Herald, the
  local sheet. Stamps to 10-12: the nine screenshots of S19 to S22 arrived at 00:11 that
  day. No place changes: Restoration leads every tab (Full buffed shows 5,883). Carried:
  the Buff worth panel.
  S21 CLOSED 2026-10-12 (patch 402), D27. Elemental Full buffed / All-time / Obtainable /
  Herald 3240 / 2392 / 2297 / 2021 (from 3246 / 2397 / 2301 / 2025); local 3239 / 2392 /
  2296 / 2021. Controls 3246 and 2397, exact, on stamps of 10-01 and 10-05. One token on
  each head line, 13crit -> 12crit, and a dated comment (Herald's replaces the one of
  patch 399); fixed-seed identical with and without it on all four. Panels: one crit
  rating less, 34.89% (149) -> 34.69% (148) on Full buffed and All-time, 34.09% (145) ->
  33.89% (144) on Obtainable, 30.27% (126) -> 30.07% (125) on Herald. Stamps to 10-12. No
  place changes: Elemental is 23rd on every tab (Full buffed shows 3,153). Carried: the
  Buff worth panel.
  T10 CLOSED with it: lint_profiles.js fails a profile that wears the Helm and Pauldrons
  of Desolation without enchant=12crit on its head line (15crit on Survival Full buffed:
  the token and the 3 crit of its stone). With the rule in, the tree before patch 401
  fails on exactly eight profiles, patch 401's on Elemental's four and this one on none.
  Four mutations are caught (no token, 13, Survival Full buffed at 12, a list with no
  stone at 15), 24 of 24 with the older ones.
  S20 CLOSED 2026-10-12 (patch 403), D26: all four arms won and all four lists landed on
  them. Herald as stored (the report DPS) -> with its spec's Obtainable gems: Fire 2894 ->
  2970 (meta gem alone 2905), Assassination 2306 -> 2345, Subtlety 1228 -> 1259, Fury 3498
  -> 3524; stored 2895 / 2305 / 1228 / 3498, local 2969 / 2344 / 1259 / 3523. 24 page rows
  change gems (9, 6, 5, 4). Each is rebuilt from its profile line and the game data in the
  list's own style (q only on a rare gem); every gemmed row of the four lists was first
  checked to be what that rebuild makes of its line. Panels, the local sheet: Fire
  Intellect 250 -> 271, mastery 7.84% (41) -> 4.54% (7); Assassination Agility 234 -> 236,
  crit 24.04% (70) -> 25.25% (76), mastery 30.65% (50) -> 23.83% (30), haste 22.82% (103)
  -> 25.15% (114); Subtlety Agility 234 -> 236, crit 23.44% (67) -> 24.64% (73), mastery
  44.17% (50) -> 34.34% (30), haste 23.45% (106) -> 25.78% (117); Fury Strength 242 -> 229,
  mastery 22.15% (39) -> 24.4% (47), haste 24.12% (115) -> 26.21% (125). Places on Herald:
  Fire 6th (from 7th, past Devourer's 2943), Assassination 16th (from 17th, past Feral's
  2340). Stamps from 10-10 (Fire, Fury) and 10-11. The banner on Fury's run is the warrior
  module's fury_mid2_4pc_crit notice, as on Arms. The nine smaller gains of the survey
  stay a lead.
  D28, 2026-10-12: Feral Obtainable's gems, the lead of the reverse reading. RULED from
  the run's three numbers: the Blasphemite and the Deft Ametrines both land (over the
  Blasphemite alone, or leaving the list).
  S22 CLOSED 2026-10-12 (patch 404). Obtainable as stored (the report DPS) 2627, exact;
  with Culminating Blasphemite in the helm's second socket 2651; with that and Deft
  Ametrine in the ten sockets of waist, legs, feet and rings 2662, the number that lands
  (local 2627 / 2650 / 2662). Six page rows change gems, rebuilt from the profile lines as
  in patch 403. Panel, the local sheet: Agility 281 -> 274, haste 28.94% (138) -> 32.82%
  (158). Place on Obtainable: 16th (from 17th, past Demonology's 2650). Stamp from 10-11.
  With it every profile outside the evokers wears a Culminating Blasphemite, 104 of 104;
  the evokers' five wear Elusive, which reads the same on Devastation's four lists.
  D29, 2026-10-12: the Desolation 4-piece stays out of the model. Set 660's second bonus is
  spell 37617: per Wowhead, attacks have a 1% chance of Heroic Resolution (37612), 25
  Agility for 15 s at level 30 (22 at level 20), and the set is not marked as a legacy set
  with inactive bonuses. Seven Herald lists wear four pieces: Marksmanship, Survival, Beast
  Mastery, Enhancement, Elemental, Restoration, Devastation; the last three are casters.
  Local build, 10,000 iterations, the proc at a literal 1% per attack on the chest line:
  Marksmanship +65 (22.6% uptime, 1.05 procs/min), Enhancement +65 raw (31.3%, 1.55),
  Survival +19 (9.5%, 0.41), Beast Mastery +18 (10.4%, 0.45). No log anchors the rate, and
  a calibrated proc has one. Four pieces pay nowhere else: on the All-time and Obtainable
  lists of those four specs the Hauberk and Gauntlets cost 75 to 136 DPS, and 22 to 79 with
  the proc counted. RULED from those numbers: leave it out. The seven lists stay as they
  are and carry the 2-piece token only; the 4-piece line has not been read in game. A log
  showing Heroic Resolution reopens it.
  Sets the engine does not know, worn with two pieces or more on the 109 lists, surveyed
  the same day: Desolation (660) on 29; Gladiator's Regalia (579: Vengeful Gladiator's
  Silk Cowl and Amice) on nine mage lists; Gladiator's Felshroud (615: Merciless
  Gladiator's Felweave Cowl and Raiment) on nine warlock lists; Onslaught Battlegear (672:
  Breastplate and Treads) on Fury Obtainable. Wowhead marks the last three as legacy sets
  with inactive bonuses, so Desolation is the only one with something to model. FLAGGED,
  not applied: the head token enchant=1sp sits on four of the nine Felweave lists
  (Destruction Full buffed, All-time and Obtainable, Affliction Full buffed) and stands
  for no bonus Wowhead shows.
  P11, two answers of 2026-10-12. 28 rows carry alternates, 54 in all, 36 different items;
  18 rows show a sweep base their list no longer has and 10 show none. All the deltas came
  from Fate's Top Gear sweeps.
  D30: the alternates are re-read like for like, from ten files built here, and the new
  deltas and bases land from Fate's runs. Each file is one list as stored, so its report
  DPS is the control; each alternate is an arm, the row's item taken off and the alternate
  put on with the row's enchant and the row's gems, as many as it has sockets (a raid
  piece gets no socket proc, as on all 65 raid wrist lines). An alternate the lists wear
  somewhere is written as it is there. Seventeen they have never worn take the level the
  page gives rows of the same source: Sunwell 44 (8), Icecrown 25-player heroic 47 (2),
  Black Temple 42 (1), Karazhan 38 (2), Ulduar 42 (4; the least sure, the page has crafted
  Ulduar at 41, 42 and 43, and between 41 and 42 only the Footpads of Silence change, by
  one haste rating). The bonus id is a label once the level is pinned: 9041, 9042 or none
  give the same item.
  Issued as S23, 37 arms on 24 rows of 10 lists: Fury All-time 2, Fury Obtainable 4,
  Retribution Full buffed 1, Frost Mage All-time 2, Feral All-time 1, Restoration
  Obtainable 11, Devourer Obtainable 11, Affliction All-time 2, Windwalker Full buffed 1,
  Devastation All-time 2. Devourer's trinket pair takes both slots and restates the
  list's trinket line for slot 2: the Armored Elekk Tusk is an on-use trinket, and unused
  it reads 3% lower. Restoration's Abracadaver takes the off hand off. Fixed seed: every
  actor equals its stored list run alone and every arm the stored list with the arm's
  lines put in, run alone, 47 of 47.
  Local reading, 10,000 iterations: 29 of the 36 arms with a page delta read within 0.8 of
  it. The six staff alternates of Frost Mage, Affliction and Devastation read -0.3% to
  -0.8% against -4.2% to -5.4% on the page. On Frost Mage, Mag'hari Chieftain's Staff
  reads -0.5% with Abracadaver's gems and enchant, -4.6% with the gems alone, -3.6% with
  the enchant alone and -7.7% bare: the old sweep fits staves that were not enchanted.
  Devourer's Wastewalker Helm reads -1.9% against -4.4%. Restoration's Abracadaver, which
  has no result on the page, reads -1.1%.
  D31: the four weapon rows stay as recorded. Fury Obtainable's Main Hand and Off Hand and
  the All-Time Main Hand of Retribution and Frost DK list 17 alternates. Fifteen are proc
  weapons the repo holds no line for on that spec: Destiny, Shadowmourne and the Singing
  Crystal Axe on any spec, a second Bonereaver's Edge beside the first, The Jackhammer on
  Retribution and Frost DK, Bonereaver's Edge on Retribution, The Untamed Blade on Frost
  DK. The other two are Apolyon on Fury's two rows, plain stats, left with its rows. All 17
  are fallbacks, the nearest at -2.0%. RULED: they keep their sweeps of record. P11 closes
  when S23 lands.
  Found on the way, FLAGGED and not acted on: socket bonuses. The engine gives an item its
  socket bonus whether or not its sockets are filled (total_stats adds it with no colour
  check); every native socket on the lists is filled, so that alone overcounts nothing.
  Of the 139 items the lists wear, 90 have one. The data scales 81 of them down, 76 to a
  single point at level 30 and none past 2, and leaves nine flat. Enchant 3303, +8 Haste:
  Abracadaver (25 lists), Plague-Soaked Leather Leggings (24), Frayed Scoundrel's Cap
  (20), Helm of the Faceless (15), Forgotten Shadow Hood (7), Helm of the Corrupted Mind
  (5). Enchant 5188, +8 Critical Strike: Cowl of Icy Breaths (3). Enchant 3015, +2
  Strength: Bracers of Eradication (20), Onslaught Treads (6). 76 of the 109 lists wear
  one to three of the six +8 Haste items; Balance wears three. It is much of what their
  alternates lose: the Wastewalker Helm has as much haste on the item as the Frayed
  Scoundrel's Cap and more of everything else. Wowhead's tooltips show the same split:
  "Socket Bonus: +8 Haste" on the leggings, beside +9 Haste on the item, and +1 Intellect
  on the Drape of Mortal Downfall at level 30. The game's own tooltip has not been read;
  it decides.
  S23 CLOSED 2026-10-12 (patch 406), D30; closes P11 and T11. Ten runs, 47 numbers. Of the
  ten controls six read the stored number exactly, two within 1 and two within 2: Fury
  All-time 4218 for 4220, Devourer Obtainable 3671 for 3673, Feral All-time 2757 for 2756,
  Devastation All-time 3290 for 3291. No list number or stamp moves; a control inside 2
  re-validates its list. Every one of the 37 arms is within 3.5 DPS of the local reading
  (32 within 2). The run's delta equals the local one on 25 and is within 0.1 on 36;
  Devourer's Drape of Mortal Downfall is the other, -0.5% against -0.7%.
  What landed: 37 deltas (29 changed or new, 8 the same) and 24 bases (16 replaced, 8
  new), each base the report DPS of the row's run. A delta is the chart's own label, which
  Raidbots computes before it rounds the DPS. From the rounded pair four would read 0.1
  otherwise: Bloodfall -0.4 for -0.5, Affliction's Mag'hari -0.6 for -0.5, Windwalker's
  Wastewalker Helm -0.2 for -0.1, Devourer's Footpads of Silence -0.0 for -0.1. The last is
  stored as 0 and shows 0.0%. Alternates stay listed best first, so four rows changed
  order: Frost Mage Main Hand, Restoration Obtainable Wrist and Legs, Devourer Obtainable
  Feet. Bands at 1.5%: the six staves go from fallback to within noise (Frost Mage -0.4
  and -0.5, Affliction -0.6 and -0.8, Devastation -0.4 and -0.7); on Fury Obtainable Chaos
  Talisman in Trinket 1 (-1.7) and Herkuml War Token in Trinket 2 (-2.0) go the other way.
  Devourer's Wastewalker Helm -1.8 (was -4.4), its trinket pair -12.4. Restoration's
  Abracadaver -1.1, its first result (4291 for 4339). Two notes follow the runs:
  Restoration Obtainable's main hand drops "its head-to-head delta on the final build is
  unsimmed", and Windwalker Full buffed's head reads "6 DPS separates the two heads" where
  it read "4 DPS ... 0.09%" (4413 and 4407).
  One alternate read above its row: Arch-Druid's Tainted Seal (47, its Timewalking
  version, one gem) at 4311 on Retribution Full buffed against the list's 4303 with
  Fleshfused Circle (33, two gems), +0.2%, as the old sweep had it. FLAGGED to Fate, not
  swapped in. Local, 50,000 iterations: the Seal +6.6, the Circle itself at 47 +4.9, the
  Signet of the False Accuser in Ring 2 at 47 +5.8, Seal and Signet both at 47 +14.7, the
  Seal at 33 with two gems +2.4. It is the level more than the ring.
  T11 (same patch): validate.js fails a row that shows a delta without an altbase, or
  with one more than 3 DPS off its list's number (the raw number on an effective list),
  and an altbase on a row with no alternate. The four rows of D31 are named in
  ALT_BASE_OLD with their ruling, printed on every run, and fail when a row no longer
  needs its entry or its reason reads as a promise. On the tree before this patch the
  rule fails exactly the 23 rows that showed a delta on an old base or on none (16 and
  7; Restoration's main hand showed no delta yet). Ten mutations of the landed page are
  caught with the message expected, 41 of 41 with the 31 older ones, and three pages the
  rule has to let through pass: a list 3 off its base, an effective list on its raw
  number, a row whose only alternate is pending.
- Enh Vibroblade P_phys refresh (2026-10-10): the factor of record keeps P = 0.514 (carried,
  Fate's ruling at the 2351 landing); the 2026-10-10 run's own damage mix measures 0.490
  (MH 18.4 + SS 17.9 + OH 9.1 + WF 3.6 - Lava Lash grew). OPEN: applying it is -6 effective
  (x1.0610 -> x1.0581). U = 0.5694 stays carried from Outlaw either way. Related: the Enh rail
  (Herald/Obtainable/All-time) came current on today's engine 2026-10-10 in one commit after the
  Herald re-run inverted the pre-drift rail - the validator's monotonic gate caught it; buffed
  3724 was already current. The audit's Enh mastery-rating typo (100-for-10) fixed on All-time
  by the fresh sheet; the Full buffed pair still reads [*, 100] and stays on watch.
  Not put to Fate on 2026-10-11: S13c re-runs all four Enhancement lists, so the factor is
  asked at that landing, on the new run's own damage mix.
  RULED 2026-10-11 at the S13 landing (D25): refresh the share on both Herald lists S13
  re-ran, each from its own mix by school (local build; a profileset arm prints no
  breakdown). Enhancement 0.514 -> 0.493 (MH 18.5 + Stormstrike 18.0 + OH 9.2 + WF 3.7):
  raw 2121 x 1.0585 = 2245. Havoc 0.474 -> 0.222: the factor of record had counted Blade
  Dance and Death Sweep (a quarter of the pie, with Trail of Ruin) as physical, and under
  First Blood their hits are Chaos (spells 391374, 391378, 393054, 393055, school mask 127;
  Trail of Ruin 258883, mask 124). The engine gives a target armor only against a purely
  physical action (action_t::composite_target_armor), so the share is the auto-attacks
  alone: raw 1640 x 1.0263 = 1683, where the old share gave 1732. Havoc Herald had read
  about 50 high since the 2026-10-03 ruling. U = 0.5694 and A = 0.2083 are unchanged.
  Windwalker's 0.973 (0.978 by school) and Outlaw's 0.969 were not part of the question and
  stand.
- Ret HoW calibration retune (2026-10-10, Fate's header note): with the overrides of record the
  merged HoW ratio now reads 0.966 game/sim; exact would retune 14488/1291900 from 2.91414 to
  ~2.81 (x1.304 instead of x1.35). OPEN - landed as-run at 2.91414. Provenance note: the stored
  09-26 Herald 2768 was stamped Raidbots Advanced while carrying these spell_data overrides,
  which Fate's header says Raidbots strips - yet today's calibrated local run lands the same
  2768 through a +/-1-rating gear wash, so either Raidbots honored them after all or the 09-26
  run was local under the wrong stamp. Today's stamp is local a0d9bbb either way.
  SETTLED 2026-10-10 (audit S2, patch 336): the stored Herald profile, verbatim on Raidbots
  Advanced at 50k, returns 2711 against the local 2710 with a digit-identical sheet - Raidbots
  HONOURS the six override lines (stripping them would cost about 9% by the report's damage
  shares), so the reason to doubt the 09-26 stamp is gone and the header note is corrected on
  the Herald profile. Herald's number and stamp move to the engine of record (2711, Raidbots
  Advanced); off-engine ledger FIVE: Ret All-time 3111 and Obtainable 2900 (one verbatim
  Raidbots run each moves them, and corrects their headers), Marksmanship All-time 3588 and
  Obtainable 3450, Resto Herald 3684. The 23 Raidbots-stamped lists carrying the same kind of
  override need no re-check on this account.
  RULED 2026-10-11: retune to 2.81 (over keeping 2.91414 as run). Local build: Full buffed
  4316 -> 4300, All-time 3115 -> 3107, Obtainable 2906 -> 2896, Herald 2710 -> 2702. Inputs
  issued as S16, two runs. The override is sim-wide, so the files carry no control arm.
  LANDED 2026-10-11 (patch 398): 4303 / 3106 / 2895 / 2702 on Fate's runs. The calibration
  of record is 2.81 on effects 14488 and 1291900; 1259264 keeps 2.18553. Closed.
- Priest VV re-runs: CLOSED 2026-10-03. The ruling retired the VV calibration block (the engine
  models Void Volley natively) and all four lists re-ran same day: buffed 5573 -> 5757,
  All-time 4065 -> 4165, Obtainable 3926 -> 3987, Herald 3589 -> 3487 - the Herald drop, the
  only gearless re-run, prices the old calibration premium at ~100 DPS.
- Burning Primal Diamond (76885) proven BiS on the DH head over the agi
  meta; sweep candidate against Mystical Skyfire (25893) on the other
  int-caster heads. The 76885 ban is shaman-scoped, as originally ruled.
  SWEPT 2026-10-11 on the local build, one gem swapped on each All-time list. Mystical
  Skyfire leads Burning Primal on the nine casters that wear it: Arcane +2, Frost Mage +10,
  Demonology +11, Destruction +13, Affliction +5, Devastation +26, Balance +27, Shadow +58,
  Devourer +39. Fire's Burning Shadowspirit (68780) ties 76885 and leads 25893 by 18.
  Elemental is right on Burning Primal (+25 over Skyfire). Restoration reads level (4420
  against 4422) and its ban stands; the linter's ban is on the Restoration entry (id
  shaman), not on Elemental. Two Herald helms went against their spec's other three lists:
  Devourer Herald wears Burning Primal (Skyfire reads +25) and Elemental Herald Mystical
  Skyfire (Burning Primal reads +14). RULED: swap both. Inputs issued as S18, two runs with
  control arms. The sweep closes with those two landings.
  LANDED 2026-10-11 (patch 399): Devourer Herald 2943, Elemental Herald 1954 on the meta
  gem alone and 2025 as landed with the set proxy and its own gems (D22). CLOSED.
  A THIRD HELM, missed by that sweep: Fire Herald wore Mystical Skyfire where Fire's other
  three lists wear Burning Shadowspirit. The Herald gem survey found it and S20 moved it
  (patch 403, 2026-10-12): the meta gem alone reads 2905 against 2894.

Closed: A (per-spec confirmed; Dragonspine resolved universal by two-log
convergence — 3.5 and 2.7 both retired for 3.2), B (public), the rogue
Eskhandar spread (both tiers rescale to the one 2.47/min item anchor).

## Expanding to all DPS specs

The page renders spec entries, not classes: each CLASSES item is one
spec with `cls` (class key) and `primary` (exactly one per class,
enforced by validate). The "Best per class" view shows each class's
highest spec on the list shown, computed per list since 2026-09-13,
with `primary` as the tiebreak; switching list switches spec where the
best differs (Druid). The "All specs" toggle stops filtering; deep
links to a spec that is not its class's best flip the view
automatically; the rail live-sorts by the selected list's DPS, so new
entries place themselves.

Adding a spec is the same loop as maintaining one: three benchmark
profiles simmed at 50k, one page entry with `primary:false` (or a
primary flip if the per-class ruling changes), stats and talents from
reports, prov stamped, filenames carrying the simmed DPS. A new visible
spec also changes the count the page states in three places: the meta
description, og:description and the share image assets/og.png (27 specs
at 2026-10-11). The linter
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

Rows: `slot, item, wowhead, ilvl, source`, optional `q, ench,
enchsp, gems, hm ("only"|"socket"), alts [{item, wowhead, q, delta}], why`.
A row also carried `status` ("sim" or "confirmed") until 2026-10-11. Nothing
read it, and ruling D10 dropped it.
Optional fields: `altbase` — the list's own DPS in the run that measured
the row's alternates; each delta is a percentage of it, and the hover on
a delta shows it. Since 2026-10-12 validate.js holds it within 3 DPS of
the list's number (T11), so a list that moves sends its alternates back
to be read; the rows ruled to keep an older sweep are named in the
validator's ALT_BASE_OLD. `prov` — a provenance stamp (sim date and
build) whose rendering is gated on ruling B.
Spec level: `rawByList {list: N}` on a spec with effective-DPS lists — the raw
sim result behind the list's number. The page's "effective" tag reads it, and
validate.js holds it to the off-hand note and to `dpsByList`.

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
  Since 2026-10-11 it holds every row to the game data in `gamedata.json`.
  Since 2026-10-12 it fails a row whose alternates were measured on a
  number its list no longer has.
- `node gamedata.js <simc checkout>` or `node gamedata.js --fetch` —
  rebuilds `gamedata.json` from SimulationCraft's client tables, for the
  ids the page and the list profiles name. Run it when a row or a profile
  line brings in a new item, gem or enchant: both gates fail on an id the
  file does not hold. `--check` only reports what is missing.
- `node lint_profiles.js [--advisory] [--page index.html] <dir>...` —
  profiles vs page and rulings. CI runs it on all four list folders and
  an error blocks (the `--advisory` flag is for trying a rule out). Since
  2026-10-11 it compares every gear line with its page row: id, item
  level, gems and enchant, rings, trinkets and proxy lines included,
  and holds each calibrated proc to the encoding solved for its spec.
  Since 2026-10-12 it fails a list that wears the Helm and Pauldrons of
  Desolation without the 2-piece token on its head line.
- `node stale.js --simc <path to simc>` — the staleness screen: runs
  every list profile unchanged on a local SimulationCraft build and lists
  those more than 5 DPS, and three standard errors, from the number on
  file. An instrument, not a gate, and never a number of record. Run it
  after a SimC data update that retunes a class: about an hour on two
  cores at 10,000 iterations, and an interrupted run resumes.
- `node diffdata.js old.html new.html` — dataset delta between two builds;
  run on HEAD~1 vs HEAD before pushing a rebase.
- `talent_sim_gen.cpp` — level-30 legal-build enumerator for profileset
  sweeps (`--tree both`, `--list`, `--exclude-file`).
- Planned: `gen_profiles.js`, page-to-profile generation, druid pilot
  first.

Every commit that modifies index.html also adds a dated CHANGELOG.txt
entry stating what changed — the page-facing record of ruling B.
CHANGELOG.txt is the single canonical file, served by the site and
linked relatively from the header. The header notice reads the first
4 KB of that file when the page loads (a Range request) and shows the
first sentence of the newest entry, 120 characters at most, so an
entry's first sentence is what a visitor reads; the newest day's other
entries are read, with the rest of the file, when a visitor opens the
list, or at once if the first request fails. CONFIG.notice is only
what shows until the feed
loads, or in its place when the fetch cannot run (file://, offline). It
stays timeless, and about as long as a feed line so the page does not
jump when the feed replaces it; no commit needs to touch it.

Commit messages are prose paragraphs — what changed and why, with
flagged-but-not-applied items listed separately.
