# Daily Briefing handover (mattcarpenter.com/briefings-preview)

## What it is
A personal daily briefing for Mattie, published at https://mattcarpenter.com/briefings-preview/ (file `briefings-preview/index.html` in this repo, served by GitHub Pages from main). It replaced three Hermes jobs on Hetzner (Last 30 Days, Daily Hank, Edge AI Hardware Watch) that kept failing on OpenRouter "insufficient credits". The main page `briefings/index.html` is still fed by Hermes and the Night Shift briefing; don't touch it from this pipeline.

## How it runs
A Grok Bot routine ("Daily briefing", daily 10:15 Europe/Malta) in the MC Briefings agent. It needs a new owner now that Grok Bot credits are ending. To keep it going, any scheduler plus any LLM can do these steps:
1. Run `gather.py` (in this folder; it writes raw.json): Hacker News Algolia, Google News RSS, GitHub search, X, Reddit.
2. Write one article: topics are Hank and on-device voice AI, edge AI hardware, SDR, Sotto Sound, Malta tech, AI agents. 3-6 items per topic, real links, one-line takeaways, merge duplicates, skip anything already in earlier entries, invent nothing.
3. Opening italic lines: (a) Valletta bins for today and tomorrow (Mon/Wed/Fri organic white bag; Tue/Sat mixed black bag; Thu recycling and cardboard grey/green bag; glass on the 1st and 3rd Friday; Sun none; 7am; source wastecollection.mt); (b) Gozo Fast Ferry morning departures 05:00-10:00 both ways from `https://gozohighspeed.com/api/Trip?departingHarbor=Gozo&arrivingHarbor=Valletta&date=YYYY-MM-DD` and the reverse (the API calls Mgarr "Gozo"; 404 means no service; flag sailings under 50 seats; never invent times).
4. End with a "Sources" footer: every source with its count or the exact failure reason (e.g. Reddit HTTP 403). Mattie wants failed sources always reported.
5. Insert the article right after `<!-- ENTRIES -->` using this markup (CI checks it): `<article class="briefing" id="b-YYYYMMDDHHMM"><p class="meta"><time datetime="YYYY-MM-DDTHH:MM+0200">...</time><span class="source">MC Briefings</span></p><h2 class="headline">Daily Briefing - D Mon YYYY</h2><div class="body">...</div></article>` (+0100 in winter). Commit and push to main.

## Hosts, accounts, secrets
- Site repo: mattcarp/mattcarpenter-site, GitHub Pages, custom domain mattcarpenter.com. CI is `.github/workflows/pr-checks.yml` (build, link check, Playwright smoke, axe).
- No paid keys are used. Reddit is blocked from servers (HTTP 403) until Mattie registers a Reddit "script" app; then set REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET (store in Infisical, never in the repo).
- Mattie's master secrets live in Infisical. Hetzner (`ssh hetzner`) still runs the Hermes jobs and the Gozo guest-breakfast product (separate repo mattcarp/mc-briefings).

## Open tasks and known issues
- Reddit access (needs the app above).
- The Elevate AI item appeared as "new" in the 14 Oct briefing but launched Aug 2025; add a date check for stale articles.
- The "Briefings ready reminder" routine is paused.
- Hermes jobs on Hetzner may still fail on OpenRouter credits; decide whether to switch them off.
- Mattie's rule: push straight to main, no PRs.
