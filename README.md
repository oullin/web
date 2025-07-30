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

### Testing the Format Workflow
A dedicated GitHub Action validates the formatting workflow on every pull request.
To run the same check locally, simply execute:

```bash
make format
```

The `make` command relies on `npx` to fetch Prettier and ESLint automatically, so no prior `npm install` is required. If `git diff` shows no changes, the workflow will succeed.
