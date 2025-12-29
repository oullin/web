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

Frontend error monitoring is available through Sentry. The current version is defined in
`src/support/sentry.ts` (SENTRY_VERSION constant). Set `VITE_SENTRY_DSN` in your
environment to enable it. Optional configuration variables:

- `VITE_SENTRY_DSN` (required) - Your Sentry DSN
- `VITE_SENTRY_RELEASE` (optional) - Release version for tracking
- `VITE_SENTRY_TRACES_SAMPLE_RATE` (default: `1.0`) - Performance monitoring sample rate
- `VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE` (default: `0.1`) - Session replay sample rate
- `VITE_SENTRY_REPLAYS_ERROR_SAMPLE_RATE` (default: `1.0`) - Error replay sample rate

### Automatic Release Tracking

The release version is automatically determined in this order:
1. `VITE_SENTRY_RELEASE` environment variable (if explicitly set)
2. `web@${GIT_SHA}` from current git commit (captured on host before Docker build)
3. `web@${TAG}` from Docker image tag (e.g., `web@v1.2.3`)
4. `web@latest` as fallback

The git SHA is automatically captured from your repository when using the Makefile build targets. For manual builds, you can set it explicitly:

**Examples:**
```bash
# Using Makefile (automatically captures git SHA)
make build-ci

# Manual build with specific release tag
TAG=v1.2.3 docker-compose build

# Manual build with explicit git SHA
GIT_SHA=$(git rev-parse --short HEAD) docker-compose build
```

When a DSN is present, the app loads Sentry from the CDN and integrates:
- Vue error boundary for component error tracking
- Router tracing for performance monitoring
- Session replay for debugging
