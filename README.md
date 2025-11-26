### Ollin's Web

:sparkles: Every time you open my site, a front-end app steps in to make everything look and feel smooth. The **oullin/web**
repository holds all the code for rendering pages, handling your clicks, and powering interactive features with Vue and TypeScript.

:cactus: Inside this repository, you’ll find Vue components written in TypeScript, plus layouts, styles, and utility scripts
organised in a clear structure. It’s where HTML, CSS, and TypeScript work together to build the user interface you see.
In a sense, **oullin/web** is the face of the “Ollin” experience—it takes data from the API, turns it into visual elements,
and reacts instantly to what you do.

:rocket: Feel free to clone **oullin/web**, install its dependencies, and run it locally. If you’d like to help improve the design
or add new features, you’re welcome to send a pull request and join the project.

> This is where the mindful movement of “Ollin” truly comes alive, one request at a time.

## Sentry

Frontend error monitoring is available through Sentry. Set `VITE_SENTRY_DSN` in your
environment to enable it. Optional sampling variables let you tune traffic:

- `VITE_SENTRY_TRACES_SAMPLE_RATE` (default: `1.0`)
- `VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE` (default: `0.1`)
- `VITE_SENTRY_REPLAYS_ERROR_SAMPLE_RATE` (default: `1.0`)

When a DSN is present, the app loads Sentry from the CDN, wires it to the Vue router for
tracing, and captures replay sessions.
