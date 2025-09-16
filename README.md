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

## Automated formatting workflow

The repository includes a GitHub Action that runs `make format` on pushes to the `main` branch. Formatting changes are pushed
to the `github-actions/format` branch and opened as a pull request. To let the workflow create pull requests, store a
personal access token with **repo** scope in the repository secrets under the name `USER_TOKEN`. The same identity can be used
for commits through the `USER_NAME` and `USER_EMAIL` secrets that are already referenced in the workflow configuration. The
workflow also runs against draft pull requests so you can test modifications to the automation without publishing updates: in
that mode it formats the code but skips pushing to the automation branch or creating a pull request on your behalf.
