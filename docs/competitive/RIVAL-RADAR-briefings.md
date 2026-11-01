# Rival Radar: Daily Briefings

*Competitive analysis of Mattie Carpenter's personal Daily Briefing. Written 1 Nov 2026 by MC Briefings, following /workspace/competitive/PLAYBOOK.md (sections 0-5 and the 1 Nov addendum). This was a lean single pass: 8 web searches and 4 GitHub API reads. REA was not run, because the open-source rivals are small Python repos whose READMEs already describe their architecture. This is research only. No tickets were created and no live system was changed.*

## 1. What we own (verified from the repo and the box)

1. **User:** Mattie, a recording engineer and builder in Malta, runs about 11 product bots (Hank voice AI, Wichita SDR, Sotto Sound, CTO, Singing, Grant Writer, and others). He is the briefing's only reader.
2. **Job to be done:** each morning, see what's new in his project areas (Hank / on-device voice AI, edge AI hardware, SDR, Sotto Sound, Malta tech, AI agents) plus two practical lines: Gozo Fast Ferry seats and Valletta bin collection. Then have the relevant items acted on.
3. **Differentiator:** it is personal and acts on his own projects. Each item is routed to the matching product bot, which decides kept or dropped and gives a reason. Those verdicts feed back into topic weighting. It runs on free tools only and is honest about sources: a "Sources" footer lists counts and exact failures.
4. **Shipped:** a Grok Bot cloud routine at 10:15 Malta time. `gather.py` pulls from HN Algolia, Google News RSS, GitHub, Hugging Face, X and Reddit (Reddit only via web search). Items are de-duplicated against `seen_urls.txt` (215 URLs). The routine publishes to https://mattcarpenter.com/briefings/ (`briefings/index.html`, newest first, 184 entries, about 570 KB, one page). A review routine at 11:00 hands items to the bots. Verdicts are logged in `decisions.log`, source health in `feedback/scorecard.tsv`, and `feedback.py` prints the topic keep rate and source failures. Sources: `docs/HANDOVER-briefings.md` and `/workspace/briefings-migration/`.
5. **Known open items, so they aren't proposed again** (from HANDOVER-briefings.md): a Reddit script app (needs Mattie), a stale-article date check (the Elevate AI item from Aug 2025 showed up as new), the paused "ready reminder" routine, and a decision on the Hermes jobs. The Linear/GitHub trackers were not searched in this pass (see the assumed list).

## 2. Competitor table

| # | Product | Link | Licence / source | Last release / activity | Price | Audience | One-line verdict |
|---|---|---|---|---|---|---|---|
| 1 | Perplexity Discover + Scheduled Tasks (Computer Automations) | https://www.perplexity.ai/help-center/en/articles/11521526-perplexity-tasks | Closed | Help docs current (Scheduled Tasks replaced older Perplexity Tasks) | Discover free; Pro from $20/mo (techarcade.io); scheduled tasks use credits | General consumers / prosumers | **Commercial leader.** Cited summaries and any-cadence scheduled briefings that "pick up where they left off", but generic and paid per run. |
| 2 | Particle | https://apps.apple.com/us/app/particle-personalized-news/id6683283775 | Closed | iOS 1.1.54 (Nov 2026); Android updated 13 Oct 2026 | Free; Particle+ $2.99/mo or $29.99/yr | Mainstream news readers | Best story clustering (multi-source, "Opposite Sides", podcast clips, listen mode), but not about *your* projects. |
| 3 | Techmeme | https://techmeme.com/about | Closed, free site | Live (River, 5-day archive) | Free; paid topic leaderboards $100 (search summary) | Tech industry | Human-edited tech river with a free RSS feed of the top 15. A good *source* for us rather than a rival. |
| 4 | Feedly Pro+ (Leo / AI Feeds) | https://docs.feedly.com/article/863-feedly-pro-support-knowledge-private | Closed | Docs current | Pro $72/yr, Pro+ $144/yr | Researchers, analysts | Strong near-duplicate grouping ("Also in", 85% overlap) and dislike→mute training, but it is a reader, not a brief. |
| 5 | Readwise Reader (Ghostreader + Daily Digest) | https://readwise.io/pricing/reader | Closed | Docs current | $9.99/mo annual, $12.99 monthly | Heavy readers | Daily Digest is a triage email, not a synthesised briefing. Auto-summary of feeds needs your own OpenAI key. |
| 6 | last30days-skill (mvanhorn) | https://github.com/mvanhorn/last30days-skill | **MIT**, open | v3.31.0, 27 Oct 2026; 66k stars (GitHub API) | Free; some sources need keys (e.g. ScrapeCreators) | Agent users (Claude Code, Cursor, etc.) | The "Last30Days-style" leader: 20+ sources with engagement counts (Reddit upvotes, HN points, Polymarket odds). Research on demand, not a daily personal brief. |
| 7 | frankzch/ai-news-brief (powers inbrief.info) | https://github.com/frankzch/ai-news-brief | **MIT**, open | pushed 12 Oct 2026; 21 stars | Free self-host; needs an LLM key (DeepSeek default) | AI-news readers, self-hosters | Closest open architecture: 370+ sources, LLM importance scoring, two-stage dedup (SimHash + pgvector), delayed re-scan of low-traction posts. |
| 8 | PierDeRogatis/ai-newsletter ("Gradient Descent") | https://github.com/PierDeRogatis/ai-newsletter | README says MIT (GitHub API shows no licence file) | pushed 17 Aug 2026 | Free (Groq free tier) | Hobbyists | Nearly our shape (GitHub Actions → GitHub Pages, seen_urls dedup), plus **RSS feed.xml**, Telegram and email outputs. |
| 9 | Pappet/ai_digest | https://github.com/Pappet/ai_digest | MIT (README) | not checked | Free; Ollama or OpenRouter | Self-hosters | Two-stage pipeline: a cheap model scores 0-10 with topic weights, then a better model summarises the top N. Keyword fallback when the LLM is down. |
| 10 | yoanbernabeu/daybrief | https://github.com/yoanbernabeu/daybrief | MIT | created Mar 2026; 5 stars | Free; Gemini | Self-hosters | GitHub Action with incremental "since last run" processing, YouTube/podcast sources and an editorial synthesis pass. |
| 11 | giftedunicorn/ai-news-bot | https://github.com/giftedunicorn/ai-news-bot | **GPL-3.0** (ideas only) | created Oct 2025; 25 stars | Free; bring your own LLM | Hobbyists | Multi-channel delivery (email, Slack, Telegram, Discord, webhook) and prompt templates. |
| 12 | ChatGPT Pulse (retired) | https://www.theverge.com/ai-artificial-intelligence/951840/openai-is-sunsetting-pulse-which-showed-you-custom-daily-digests-in-chatgpt | Closed | **Retired June 2026** (search summary) | was Pro | ChatGPT users | Had thumbs up/down and "curate" feedback on daily cards. Its shutdown shows that generic personal digests are hard to sustain. |

## 3. Evidence notes (what each rival does that we don't)

- **Perplexity Scheduled Tasks:** any cadence down to 15 minutes; delivery in-app, mobile push, web push or email; "notifies you instead of guessing" when stuck; each run uses credits (help-center link above). Automations "use prior work to pick up where it left off" (https://www.perplexity.ai/hub/academy/how-to-use-automations). Discover has no scheduled push (techarcade.io review).
- **Particle:** multi-source story clusters, "Opposite Sides" view, political spectrum chart, Q&A per story, listen mode, follow entities and get notified, daily digest push, podcast clips found via vector embeddings (App Store listing; TechCrunch 23 Feb 2026, https://techcrunch.com/2026/02/23/particles-ai-news-app-listens-to-podcasts-for-interesting-clips-so-you-you-dont-have-to/).
- **Feedly:** content-based dedup above 85% overlap within a 31-day window, across sources only (https://docs.feedly.com/article/218-how-does-deduplication-work). Similar stories grouped under "Also in". Mute filters. Dislike → mute site or topic (coywolf.com Pro+ article).
- **Readwise:** Daily Digest is triage of Feed and Later items (https://docs.readwise.io/reader/docs/faqs/daily-digest). Auto-summaries for feed items need the user's own OpenAI key (Ghostreader docs).
- **last30days:** per-source engagement signals (Reddit upvotes, HN points/comments, Polymarket odds, GitHub release notes). Techmeme and arXiv are free keyless sources. Local corpus option (README and CONFIGURATION.md links above). X needs cookie tokens or an xAI key.
- **ai-news-brief:** two-stage dedup, importance score, engagement gates with delayed re-scan, HN comment threads, GitHub Trending (README).
- **ai-newsletter:** writes `docs/feed.xml` (RSS) and `docs/issues/YYYY-MM-DD.html` per-issue archive pages, plus Telegram (README architecture block).
- **ai_digest:** score 0-10 with topic weighting; keyword fallback when the LLM is unavailable (README).
- **Our page (verified on origin/main 1332d8e):** one 570 KB HTML file with 184 entries. No RSS/Atom link, no audio, no search, no per-day permalink pages. Some item links are raw `news.google.com/rss/articles/...` redirects, even though `gndecode.py` exists.

## 4. Candidate features (max 12)

1. **You can subscribe to the briefing in any reader, or get a push when it lands.**
   - Who has it: ai-newsletter writes `feed.xml`; Particle and Perplexity push.
   - Fit: protects (free, still on our own site). Impact M, effort S.
   - Risk: none. A static `briefings/feed.xml` generated at publish time; CI link check may need to allow it.
   - **Do now.** A small change that also makes the reminder routine unnecessary.
2. **Every item says why it was picked and which of your bots will review it.**
   - Who has it: nobody does this per project. The closest are Perplexity's "pick up where it left off" and Particle's follow-entity alerts.
   - Fit: **extends** the core differentiator. Impact H, effort S.
   - Risk: page markup must keep CI-valid classes.
   - **Do now.** It makes the routing visible on the page, which no rival can copy.
3. **Yesterday's bot verdicts show up in today's briefing, e.g. "Hank kept Parakeet Ultra: drop-in for Maltese".**
   - Who has it: ChatGPT Pulse had thumbs/curate (retired); Feedly has dislike→mute. Neither shows *agent* verdicts.
   - Fit: **extends**. Impact H, effort S (the data already sits in `decisions.log`).
   - **Do now.** It closes the loop where Mattie reads it each morning.
4. **The same story from several outlets collapses into one item with "also in" links.**
   - Who has it: Feedly ("Also in", 85% overlap), Particle (multi-source stories), ai-news-brief (SimHash + embeddings).
   - Fit: neutral/protects. Impact M, effort M (title similarity first; embeddings later and only with free models).
   - **Next.** We dedup by URL only today.
5. **Old news can't sneak in as new: every item carries its publish date, and anything older than N days is dropped.**
   - Who has it: last30days (date-windowed, undated items marked low-confidence); daybrief (only since last run).
   - Fit: protects honesty. Impact M, effort S. This is already an open handover item, so it is a fix, not a new feature.
   - **Next** (or Do now if the Elevate-style miss repeats).
6. **Links go straight to the article, not a Google News redirect.**
   - Who has it: every reader app.
   - Fit: protects source honesty. Impact M, effort S (`gndecode.py` already exists; apply it at publish time).
   - **Do now.**
7. **Items show public engagement (HN points, Reddit upvotes, GitHub stars or release age), so hype and signal are visible.**
   - Who has it: last30days (MIT), ai-news-brief (engagement gates).
   - Fit: extends honesty. Impact M, effort S for HN/GitHub (free APIs already used). Reddit stays via web search.
   - **Next.**
8. **A cheap first pass scores each candidate 0-10 against your projects, with weights that move with the keep rate.**
   - Who has it: ai_digest (two-stage scoring + topic weights), ai-news-brief (importance score).
   - Fit: **extends** the self-improving loop: `feedback.py` turns from guidance into actual weights. Impact H, effort M.
   - Risk: must stay on free models; no OpenRouter.
   - **Next.**
9. **Each day gets its own permalink page plus a lighter main page.**
   - Who has it: ai-newsletter (`docs/issues/YYYY-MM-DD.html`), daybrief archive.
   - Fit: neutral. Impact M (the 570 KB page will keep growing), effort M.
   - Risk: the Hermes/Night Shift writers also insert into index.html, so they must be coordinated.
   - **Later.**
10. **Listen to the briefing as audio on the walk to the ferry.**
    - Who has it: Particle (listen mode, voice choice), Perplexity Discover (TTS on mobile).
    - Fit: neutral; it could use Hank/Sotto voice work as dogfood. Impact M, effort M.
    - Risk: free TTS only; any paid voice API needs Mattie's okay.
    - **Later.**
11. **Add Techmeme and arXiv as free sources.**
    - Who has it: last30days uses both keyless; Techmeme publishes a free top-15 RSS (techmeme.com).
    - Fit: protects (free). Impact L-M, effort S.
    - **Next.** Low cost, but it adds noise unless filtered by #8.
12. **Ask the briefing a question about any item.**
    - Who has it: Particle, Perplexity Discover.
    - Fit: neutral. Mattie can already ask MC Briefings in chat. Impact L, effort L.
    - **Skip.** Chat already covers it.

## 5. What competitors are bad at that we can own

- **Acting on the reader's own work.** No rival routes items to project owners who decide keep/drop with a reason. Pulse, the nearest attempt, was retired in June 2026.
- **Honest failure reporting.** Rivals skip failed feeds silently (ai-newsletter: "skipped silently and logged at WARNING"). We print every source's count and exact failure on the page.
- **Hyper-local practical lines.** Ferry seats and bin day sit next to edge-AI news. No digest product does this.
- **Zero running cost with no keys.** Perplexity charges credits per run, Readwise needs your OpenAI key for feed summaries, and most open repos need an LLM API key.
- **Niche technical depth** (SDR, Maltese ASR, Jetson) that mainstream apps (Particle: "US news" complaints in Play reviews) don't cover.

## 6. Open decisions for Mattie (one at a time, numbered)

1. OK to do the four small "Do now" items (#1 RSS feed, #2 why-picked line, #3 yesterday's verdicts, #6 direct links) in one change to `briefings/index.html` and the routine prompt?
2. Should items older than 14 days be dropped automatically (#5), or only flagged as "older"?
3. Audio (#10): want a free-TTS trial later? Any paid voice would need your separate okay.

## 7. Verified vs assumed

**Verified this pass (link or file):** all Perplexity, Particle, Feedly, Readwise and last30days claims above (pages linked). Open-repo licences and activity: frankzch MIT, pushed 12 Oct 2026; last30days MIT, v3.31.0 on 27 Oct 2026, 66,203 stars; PierDeRogatis pushed 17 Aug 2026 with no licence file detected by the GitHub API (README says MIT); giftedunicorn GPL-3.0; daybrief MIT. Our own page facts (184 entries, 570 KB, no feed, Google News redirect links), the `feedback.py` behaviour, `decisions.log`, `scorecard.tsv` and the 215 seen URLs.

**From search summaries, not opened directly:** Readwise prices ($9.99/$12.99), Perplexity Pro $20/mo (techarcade.io), Techmeme $100 paid leaderboards, ChatGPT Pulse retirement month (June 2026), Pappet/ai_digest licence and activity.

**Assumed / not checked:** Linear MAT and GitHub issues were not searched for duplicates; MC CTO should check before any ticket is made. Effort sizes are estimates. No REA run, so the closed apps' hidden features are unknown.
