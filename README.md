[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Niuyyuy/neon-bay-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Niuyyuy/neon-bay-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Neon Bay Trophy Guide — Grand Theft Auto VI, all 55 PS5 trophies

An offline guide and tracker for the 55 PlayStation 5 trophies of Grand Theft Auto VI, built for the [make.fun bounty gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01). Try make.fun yourself: https://make.fun/r/0wvmb34n

## What it is

- **All 55 trophies** with their official name, description and grade as PlayStation publishes them (1 platinum, 2 gold, 6 silver, 46 bronze, 28 of them hidden) — the list in `app/data/trophies.json`.
- **A guide for every trophy in our own words**, each one naming its source beside it (PowerPyx, Output Lag, EGamers/GTABase, Exophase/PSNProfiles). Nothing is copied from another guide; five trophies with no confirmed method at launch say so honestly instead of inventing one.
- **A roadmap to the Platinum** in three stages — story, 100% completion checklist, cleanup — plus the checklist at a glance (300 of 397 stunts, 42 of 42 shooting range golds, 15 of 18 card sets, 200 of 277 vehicles, 100 of 255 animals, 70 of 80 challenges).
- **The one missable trophy flagged**: Positive Mental Attitude — Lucia's balcony meditation in Chapter 1 disappears once that chapter ends. The guide also warns about the time-sensitive Race Against Yago in Chapter 3 and the lack of mission replay.
- **A tracker**: tick trophies off and progress is saved in the browser (localStorage); export it to a file and import it back. Filters by kind (story, missable, collectibles, activities, robbery, online — there are no online trophies) and by grade, plus search and a hide-earned switch.
- **Spoiler-free mode**: story trophies stay hidden — name, description and guide — until you earn them.

## How to use it

Serve `app/` with any static server and open `index.html`, or run `node serve.ts` and open http://localhost:8080. It works with the network off: every file it loads is under `app/`, and it fetches nothing at run time.

Deterministic scenes for screenshots live in `app/src/shots.js` and `shots.json`: `?shot=guide`, `?shot=tracker`, `?shot=roadmap`, `?shot=spoiler` (each with `&seed=1`). Each scene stages itself and sets `window.__shotReady` when ready to capture.

## Sources

The trophy list is the official PlayStation list as carried by Exophase and PSNProfiles. Methods and numbers are drawn from launch-week guides and cross-checked between them. Full links:

- PowerPyx — GTA 6 Trophy Guide & Roadmap: https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/
- PowerPyx — GTA 6 100% Completion Checklist & Guide: https://www.powerpyx.com/gta-6-100-completion-checklist-guide/
- Output Lag — GTA 6 Trophy List: All 55 Trophies and Achievements: https://outputlag.com/guides/gta-6-trophy-list/
- EGamers — GTA 6 Trophy List (GTABase and PowerPyx): https://egamers.io/gta-6-trophy-list-all-55-trophies-and-achievements-plus-the-hardest-ones/
- EGamers — GTA 6 100% Completion: The Full Checklist: https://egamers.io/gta-6-100-completion-the-full-checklist-and-what-each-section-needs/

Every trophy's guide names its sources in the app.

## License

MIT — see LICENSE.
