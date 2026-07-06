# PostHog post-wizard report

The wizard has completed a PostHog event tracking integration for mattcarpenter.com. This is a static HTML site (not Next.js) with PostHog already loaded via CDN snippet in both pages. No package installation was required. Two files were edited to add `posthog.capture()` calls for the four planned events.

| Event | Description | File |
|---|---|---|
| `cairn_section_viewed` | Fires via IntersectionObserver when a Cairn spec section enters the viewport (20% threshold). Captures `section` property. Each section fires only once per page load. | `rl/cairn/web.jsx` |
| `cairn_nav_clicked` | Fires when a user clicks a nav link in the Cairn sticky header. Captures `section` property matching the anchor target. | `rl/cairn/web.jsx` |
| `cairn_footer_reached` | Fires once when the Cairn page footer enters viewport (50% threshold). Indicates a full read-through. | `rl/cairn/web.jsx` |
| `homepage_bunny_clicked` | Fires when a visitor clicks the golden bunny SVG on the homepage. | `index.html` |

## Next steps

We've built some insights and a dashboard to keep an eye on reader engagement:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/401678/dashboard/1525633
- **Cairn — section reach breakdown**: https://us.posthog.com/project/401678/insights/6o0n6b3x
- **Cairn — nav clicks by section**: https://us.posthog.com/project/401678/insights/QWduaj8B
- **Cairn — full read-through (footer reached)**: https://us.posthog.com/project/401678/insights/8fSgjmy7
- **Homepage — bunny clicks**: https://us.posthog.com/project/401678/insights/ofNJVjbI
- **Cairn — section engagement funnel**: https://us.posthog.com/project/401678/insights/9Nayo20j

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
